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
    if (Array.isArray(arg)) {
      return arg;
    } else if (!arg || arg[key] === undefined) {
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
}) satisfies z.ZodType<Reference>;

export interface Reference {
  reference: number;
}

export const SecuritySchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  onlineId: z.string().optional(),
  name: z.string(),
  currencyCode: CurrencyUnitSchema,
  isin: z.string().length(12),
  wkn: z.coerce.string().length(6).optional(),
  tickerSymbol: z.string().optional(),
  feed: z.string().optional(),
  isRetired: z.boolean(),
  updatedAt: z.string().datetime(),
}) satisfies z.ZodType<Security>;

export interface Security {
  id: number;
  uuid: string;
  onlineId?: string | undefined;
  name: string;
  currencyCode: CurrencyUnit;
  isin: string;
  wkn?: string | undefined;
  tickerSymbol?: string | undefined;
  feed?: string | undefined;
  isRetired: boolean;
  updatedAt: string;
}

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
}) satisfies z.ZodType<Transaction>;

export interface Transaction {
  id: number;
  uuid: string;
  date: string;
  currencyCode: CurrencyUnit;
  amount: number;
  security?: Reference | undefined;
  crossEntry?: CrossEntry | undefined;
  shares: number;
  note?: string | undefined;
  source?: string | undefined;
  units?: TransactionUnit[] | undefined;
  updatedAt: string;
}

export const AccountTransactionSchema = TransactionSchema.extend({
  type: AccountTransactionTypeSchema,
}) satisfies z.ZodType<AccountTransaction>;

export interface AccountTransaction extends Transaction {
  type: AccountTransactionType;
}

export const PortfolioTransactionSchema = TransactionSchema.extend({
  type: PortfolioTransactionTypeSchema,
}) satisfies z.ZodType<PortfolioTransaction>;

export interface PortfolioTransaction extends Transaction {
  type: PortfolioTransactionType;
}

export const AccountSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  currencyCode: CurrencyUnitSchema,
  note: z.string().optional(),
  isRetired: z.boolean(),
  transactions: ArraySchema(AccountTransactionSchema.or(ReferenceSchema), 'account-transaction'),
  updatedAt: z.string().datetime(),
}) satisfies z.ZodType<Account>;

export interface Account {
  id: number;
  uuid: string;
  name: string;
  currencyCode: CurrencyUnit;
  note?: string | undefined;
  isRetired: boolean;
  transactions: (AccountTransaction | Reference)[];
  updatedAt: string;
}

export const PortfolioSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  note: z.string().optional(),
  isRetired: z.boolean(),
  referenceAccount: ReferenceSchema,
  transactions: ArraySchema(PortfolioTransactionSchema.or(ReferenceSchema), 'portfolio-transaction'),
  updatedAt: z.string().datetime(),
}) satisfies z.ZodType<Portfolio>;

export interface Portfolio {
  id: number;
  uuid: string;
  name: string;
  note?: string | undefined;
  isRetired: boolean;
  referenceAccount: Reference;
  transactions: (PortfolioTransaction | Reference)[];
  updatedAt: string;
}

export const AccountTransferEntrySchema = z.object({
  class: z.literal('account-transfer'),
  id: z.number(),
  accountFrom: ReferenceSchema, // ReferenceSchema might be wrong, check later, also look at union with AccountSchema etc.
  transactionFrom: ReferenceSchema,
  accountTo: ReferenceSchema,
  transactionTo: ReferenceSchema,
}) satisfies z.ZodType<AccountTransferEntry>;

export interface AccountTransferEntry {
  class: 'account-transfer';
  id: number;
  accountFrom: Reference;
  transactionFrom: Reference;
  accountTo: Reference;
  transactionTo: Reference;
}

export const BuySellEntrySchema = z.object({
  class: z.literal('buysell'),
  id: z.number(),
  portfolio: ReferenceSchema.or(PortfolioSchema),
  portfolioTransaction: ReferenceSchema.or(PortfolioTransactionSchema),
  account: ReferenceSchema.or(AccountSchema),
  accountTransaction: ReferenceSchema.or(AccountTransactionSchema),
}) satisfies z.ZodType<BuySellEntry>;

export interface BuySellEntry {
  class: 'buysell';
  id: number;
  portfolio: Reference | Portfolio;
  portfolioTransaction: Reference | PortfolioTransaction;
  account: Reference | Account;
  accountTransaction: Reference | AccountTransaction;
}

export const AccountTransferReferenceEntrySchema = z.object({
  class: z.preprocess(arg => arg === 'account-transfer-reference' ? arg : arg + '-reference', z.literal('account-transfer-reference')) as z.ZodEffects<z.ZodLiteral<string>, "account-transfer-reference", "account-transfer-reference">,
  reference: z.number(),
}) satisfies z.ZodType<AccountTransferReferenceEntry>;

export interface AccountTransferReferenceEntry {
  class: 'account-transfer-reference';
  reference: number;
}

export const BuySellReferenceEntrySchema = z.object({
  class: z.preprocess(arg => arg === 'buysell-reference' ? arg : arg + '-reference', z.literal('buysell-reference')) as z.ZodEffects<z.ZodLiteral<string>, "buysell-reference", "buysell-reference">,
  reference: z.number(),
}) satisfies z.ZodType<BuySellReferenceEntry>;

export interface BuySellReferenceEntry {
  class: 'buysell-reference';
  reference: number;
}

export const ClientDataSchema = z.object({
  id: z.number(),
  version: z.number(),
  baseCurrency: CurrencyUnitSchema,
  securities: ArraySchema(SecuritySchema, 'security'),
  accounts: ArraySchema(AccountSchema, 'account'),
  portfolios: ArraySchema(ReferenceSchema, 'portfolio'),
}) satisfies z.ZodType<ClientData>;

export interface ClientData {
  id: number;
  version: number;
  baseCurrency: CurrencyUnit;
  securities: Security[];
  accounts: Account[];
  portfolios: Reference[];
}

export const ClientStateSchema = z.enum(
  [
    'empty',
    'initial',
    'hydrating',
    'hydrated'
  ]
);

export type ClientState = z.infer<typeof ClientStateSchema>;

export const ClientSchema = z.object({
  data: ClientDataSchema.optional(),
  state: ClientStateSchema,
}) satisfies z.ZodType<Client>;

export interface Client {
  data?: ClientData | undefined;
  state: ClientState;
}
