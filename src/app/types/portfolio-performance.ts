/* eslint-disable */

export type Account = {
  uuid: string;
  name: string;
  currencyCode: CurrencyUnit;
  note?: string;
  isRetired: boolean;
  transactions: AccountTransaction[];
  updatedAt: string; // ISO 8601 formatted datetime string
};

export type AccountTransaction = Transaction & {
  type: AccountTransactionType;
};

export type PortfolioTransaction = Transaction & {
  type: PortfolioTransactionType;
};

export type Security = {
  uuid: string;
  onlineId: string;
  name: string;
  currencyCode: CurrencyUnit;
  isin: string;
  wkn: string;
  feed: string;
  isRetired: boolean;
  updatedAt: string; // ISO 8601 formatted Instant string
};

export interface CrossEntry {
  // TODO: Add cross entry properties
}

export type AccountTransferEntry = CrossEntry & {
  accountFrom: Account;
  transactionFrom: AccountTransaction;
  accountTo: Account;
  transactionTo: AccountTransaction;
};

export type BuySellEntry = CrossEntry & {
  portfolio: Portfolio;
  portfolioTransaction: PortfolioTransaction;
  account: Account;
  accountTransaction: AccountTransaction;
};

export type Portfolio = {
  uuid: string;
  name: string;
  note?: string;
  isRetired: boolean;
  referenceAccount: Account;
  transactions: PortfolioTransaction[];
  updatedAt: string; // ISO 8601 formatted Instant string
};

export type Transaction = {
  uuid: string;
  date: string; // ISO 8601 formatted LocalDateTime string (YYYY-MM-DDTHH:mm)
  currencyCode: CurrencyUnit;
  amount: number;
  security: Security;
  crossEntry: CrossEntry;
  shares: number;
  note?: string;
  source?: string;
  units: TransactionUnit[];
  updatedAt: string; // ISO 8601 formatted Instant string
};

export enum AccountTransactionType {
  DEPOSIT = "DEPOSIT",
  REMOVAL = "REMOVAL",
  INTEREST = "INTEREST",
  INTEREST_CHARGE = "INTEREST_CHARGE",
  DIVIDENDS = "DIVIDENDS",
  FEES = "FEES",
  FEES_REFUND = "FEES_REFUND",
  TAXES = "TAXES",
  TAX_REFUND = "TAX_REFUND",
  BUY = "BUY",
  SELL = "SELL",
  TRANSFER_IN = "TRANSFER_IN",
  TRANSFER_OUT = "TRANSFER_OUT",
}

export namespace AccountTransactionType {
  const debitTypes: Set<AccountTransactionType> = new Set([
    AccountTransactionType.REMOVAL,
    AccountTransactionType.INTEREST_CHARGE,
    AccountTransactionType.FEES,
    AccountTransactionType.TAXES,
    AccountTransactionType.BUY,
    AccountTransactionType.TRANSFER_OUT,
  ]);

  export function isDebit(type: AccountTransactionType): boolean {
    return debitTypes.has(type);
  }

  export function isCredit(type: AccountTransactionType): boolean {
    return !isDebit(type);
  }
}


export enum PortfolioTransactionType {
  BUY = "BUY",
  SELL = "SELL",
  TRANSFER_IN = "TRANSFER_IN",
  TRANSFER_OUT = "TRANSFER_OUT",
  DELIVERY_INBOUND = "DELIVERY_INBOUND",
  DELIVERY_OUTBOUND = "DELIVERY_OUTBOUND",
}

export namespace PortfolioTransactionType {
  const purchaseTypes: Set<PortfolioTransactionType> = new Set([
    PortfolioTransactionType.BUY,
    PortfolioTransactionType.TRANSFER_IN,
    PortfolioTransactionType.DELIVERY_INBOUND,
  ]);

  export function isPurchase(type: PortfolioTransactionType): boolean {
    return purchaseTypes.has(type);
  }

  export function isLiquidation(type: PortfolioTransactionType): boolean {
    return !isPurchase(type);
  }
}

export type TransactionUnit = {
  type: TransactionUnitType;
  amount: number;
  currency: CurrencyUnit;
};

export enum TransactionUnitType {
  GROSS_VALUE = "GROSS_VALUE",
  TAX = "TAX",
  FEE = "FEE",
}

export enum CurrencyUnit {
  EUR = "EUR",
  USD = "USD",
}
