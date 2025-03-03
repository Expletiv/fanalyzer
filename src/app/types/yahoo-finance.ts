import yahooFinance from 'yahoo-finance2';

/**
 * A utility type that extracts all overloads of a function with up to 5 overloads.
 */
type ExtractOverloads<T> =
  T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
    (...args: infer A5): infer R5;
  } ? [
    { args: A1, result: R1 },
    { args: A2, result: R2 },
    { args: A3, result: R3 },
    { args: A4, result: R4 },
    { args: A5, result: R5 },
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
  } ? [
    { args: A1, result: R1 },
    { args: A2, result: R2 },
    { args: A3, result: R3 },
    { args: A4, result: R4 },
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
  } ? [
    { args: A1, result: R1 },
    { args: A2, result: R2 },
    { args: A3, result: R3 },
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
  } ? [
    { args: A1, result: R1 },
    { args: A2, result: R2 },
  ] : T extends (...args: infer A) => infer R ? [
    { args: A, result: R }
  ] : [];

/**
 * Converts the array of overloads into a union type.
 *
 * Each union member contains the arguments and the return type.
 */
type OverloadUnion<T> = ExtractOverloads<T>[number];

/**
 * Extracts the return type of a function based on the arguments passed to it.
 */
type FindResult<TFunc, TArgs> = OverloadUnion<TFunc> extends infer O ?
  O extends { args: infer A, result: infer R } ?
    TArgs extends A ? R : never :
    never :
  never;

/**
 * Creates an overloaded function from a function with multiple overloads.
 */
export function createOverloadedFn<T extends (...args: any[]) => any>(fn: T) {
  return function <Args extends OverloadUnion<T>['args']>(
    ...args: Args
  ): FindResult<T, Args> {
    return fn(...args);
  };
}

// In Webstorm, enable "use types from server" in the TypeScript settings for this to work
interface YahooFinanceMethodMap {
  search: OverloadUnion<typeof yahooFinance.search>;
  chart: OverloadUnion<typeof yahooFinance.chart>;
}
export type YahooFinanceMethod = keyof YahooFinanceMethodMap;
export type YahooFinanceParams<T extends YahooFinanceMethod> = YahooFinanceMethodMap[T]['args'];
export type YahooFinanceResult<TMethod extends YahooFinanceMethod, TArgs extends any[]> =
  YahooFinanceMethodMap[TMethod] extends infer O ? O extends {
    args: infer A,
    result: infer R
  } ? TArgs extends A ? R : never : never : never;

export enum YahooFinanceChartRange {
  ONE_DAY = '1d',
  FIVE_DAYS = '5d',
  ONE_MONTH = '1mo',
  THREE_MONTHS = '3mo',
  SIX_MONTHS = '6mo',
  ONE_YEAR = '1y',
  TWO_YEARS = '2y',
  FIVE_YEARS = '5y',
  TEN_YEARS = '10y',
  YTD = 'ytd',
  MAX = 'max',
  CUSTOM = 'custom',
}

export enum YahooFinanceChartInterval {
  ONE_MINUTE = '1m',
  TWO_MINUTES = '2m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  SIXTY_MINUTES = '60m',
  NINETY_MINUTES = '90m',
  ONE_HOUR = '1h',
  ONE_DAY = '1d',
  FIVE_DAYS = '5d',
  ONE_WEEK = '1wk',
  ONE_MONTH = '1mo',
  THREE_MONTHS = '3mo',
}
