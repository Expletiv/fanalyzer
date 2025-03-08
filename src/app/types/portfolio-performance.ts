import { z } from "zod";

/* eslint-disable */
export const CurrencyUnitSchema = z.enum(["EUR", "USD"]);
export type CurrencyUnit = z.infer<typeof CurrencyUnitSchema>;

export const TransactionUnitTypeSchema = z.enum(["GROSS_VALUE", "TAX", "FEE"]);
export type TransactionUnitType = z.infer<typeof TransactionUnitTypeSchema>;

export const TransactionUnitSchema = z.object({
  type: TransactionUnitTypeSchema,
  amount: z.object({
    amount: z.number(),
    currency: CurrencyUnitSchema,
  }),
});
export type TransactionUnit = z.infer<typeof TransactionUnitSchema>;

export const AccountTransactionTypeSchema = z.enum([
  "DEPOSIT", "REMOVAL", "INTEREST", "INTEREST_CHARGE", "DIVIDENDS",
  "FEES", "FEES_REFUND", "TAXES", "TAX_REFUND", "BUY", "SELL",
  "TRANSFER_IN", "TRANSFER_OUT"
]);
export type AccountTransactionType = z.infer<typeof AccountTransactionTypeSchema>;

export namespace AccountTransactionType {
  const debitTypes: Set<AccountTransactionType> = new Set([
    "REMOVAL",
    "INTEREST_CHARGE",
    "FEES",
    "TAXES",
    "BUY",
    "TRANSFER_OUT"
  ]);

  export function isDebit(type: AccountTransactionType): boolean {
    return debitTypes.has(type);
  }

  export function isCredit(type: AccountTransactionType): boolean {
    return !debitTypes.has(type);
  }
}

export const PortfolioTransactionTypeSchema = z.enum([
  "BUY", "SELL", "TRANSFER_IN", "TRANSFER_OUT", "DELIVERY_INBOUND", "DELIVERY_OUTBOUND"
]);
export type PortfolioTransactionType = z.infer<typeof PortfolioTransactionTypeSchema>;

export namespace PortfolioTransactionType {
  const purchaseTypes: Set<PortfolioTransactionType> = new Set([
    "BUY",
    "TRANSFER_IN",
    "DELIVERY_INBOUND",
  ]);

  export function isPurchase(type: PortfolioTransactionType): boolean {
    return purchaseTypes.has(type);
  }

  export function isLiquidation(type: PortfolioTransactionType): boolean {
    return !purchaseTypes.has(type);
  }
}

export const ArraySchema = <T extends z.ZodTypeAny>(type: T, key: string) => {
  return z.preprocess((arg: any) => {
    if (!arg || arg[key] === undefined) {
      return [];
    } else if (!Array.isArray(arg[key])) {
      return [arg[key]];
    } else {
      return arg[key];
    }
  }, z.array(type)) as z.ZodEffects<z.ZodArray<T>, T["_output"][], T["_output"][]>; // see problem with unknown https://github.com/colinhacks/zod/issues/3537
}

export const ReferenceSchema = z.object({
  reference: z.number()
})
export type Reference = z.infer<typeof ReferenceSchema>;

export const SecuritySchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  onlineId: z.string().optional(),
  name: z.string(),
  currencyCode: CurrencyUnitSchema,
  isin: z.string().length(12),
  wkn: z.coerce.string().length(6).optional(),
  feed: z.string().optional(),
  isRetired: z.boolean(),
  updatedAt: z.string().datetime(),
});
export type Security = z.infer<typeof SecuritySchema>;

export type CrossEntry = AccountTransferEntry | BuySellEntry | AccountTransferReferenceEntry | BuySellReferenceEntry;
export const CrossEntrySchema: z.ZodType<CrossEntry> = z.lazy(() =>
  z.union([
    AccountTransferEntrySchema,
    BuySellEntrySchema,
    AccountTransferReferenceEntrySchema,
    BuySellReferenceEntrySchema,
  ])
);

const TransactionSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  date: z.string(),
  currencyCode: CurrencyUnitSchema,
  amount: z.number(),
  security: ReferenceSchema.optional(),
  crossEntry: CrossEntrySchema.optional(),
  shares: z.number(),
  note: z.string().optional(),
  source: z.string().optional(),
  units: ArraySchema(TransactionUnitSchema, 'unit').optional(),
  updatedAt: z.string().datetime(),
});

export const AccountTransactionSchema = TransactionSchema.extend({
  type: AccountTransactionTypeSchema,
});
export type AccountTransaction = z.infer<typeof AccountTransactionSchema>;

export const PortfolioTransactionSchema = TransactionSchema.extend({
  type: PortfolioTransactionTypeSchema,
});
export type PortfolioTransaction = z.infer<typeof PortfolioTransactionSchema>;

export const AccountSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  currencyCode: CurrencyUnitSchema,
  note: z.string().optional(),
  isRetired: z.boolean(),
  transactions: ArraySchema(AccountTransactionSchema.or(ReferenceSchema), 'account-transaction'),
  updatedAt: z.string().datetime(),
});
export type Account = z.infer<typeof AccountSchema>;

export const PortfolioSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  note: z.string().optional(),
  isRetired: z.boolean(),
  referenceAccount: ReferenceSchema,
  transactions: ArraySchema(PortfolioTransactionSchema.or(ReferenceSchema), 'portfolio-transaction'),
  updatedAt: z.string().datetime(),
});
export type Portfolio = z.infer<typeof PortfolioSchema>;

export const AccountTransferEntrySchema = z.object({
  class: z.literal('account-transfer'),
  id: z.number(),
  accountFrom: ReferenceSchema, // ReferenceSchema might be wrong, check later, also look at union with AccountSchema etc.
  transactionFrom: ReferenceSchema,
  accountTo: ReferenceSchema,
  transactionTo: ReferenceSchema,
});
export type AccountTransferEntry = z.infer<typeof AccountTransferEntrySchema>;

export const BuySellEntrySchema = z.object({
  class: z.literal('buysell'),
  id: z.number(),
  portfolio: ReferenceSchema.or(PortfolioSchema),
  portfolioTransaction: ReferenceSchema.or(PortfolioTransactionSchema),
  account: ReferenceSchema.or(AccountSchema),
  accountTransaction: ReferenceSchema.or(AccountTransactionSchema),
}) satisfies z.ZodType<BuySellEntry>;
export type BuySellEntry = {
  class: 'buysell';
  id: number;
  portfolio: Reference | Portfolio;
  portfolioTransaction: Reference | PortfolioTransaction;
  account: Reference | Account;
  accountTransaction: Reference | AccountTransaction;
}

export const AccountTransferReferenceEntrySchema = z.object({
  class: z.preprocess(arg => arg + '-reference', z.literal('account-transfer-reference')) as z.ZodEffects<z.ZodLiteral<string>, "account-transfer-reference", "account-transfer-reference">,
  reference: z.number(),
});
export type AccountTransferReferenceEntry = z.infer<typeof AccountTransferReferenceEntrySchema>;

export const BuySellReferenceEntrySchema = z.object({
  class: z.preprocess(arg => arg + '-reference', z.literal('buysell-reference')) as z.ZodEffects<z.ZodLiteral<string>, "buysell-reference", "buysell-reference">,
  reference: z.number(),
});
export type BuySellReferenceEntry = z.infer<typeof BuySellReferenceEntrySchema>;


export const ClientSchema = z.object({
  id: z.number(),
  version: z.number(),
  baseCurrency: CurrencyUnitSchema,
  securities: ArraySchema(SecuritySchema, 'security'),
  accounts: ArraySchema(AccountSchema, 'account'),
  portfolios: ArraySchema(ReferenceSchema, 'portfolio'),
});
export type Client = z.infer<typeof ClientSchema>;
