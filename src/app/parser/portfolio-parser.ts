import {
  Account, AccountSchema,
  ArraySchema
} from '../types/portfolio-performance';

export function parseAccounts(accounts: any): Account[] {
  const safeParse = ArraySchema(AccountSchema, 'account').safeParse(accounts);

  if (!safeParse.success) {
    console.error('Error parsing accounts', safeParse.error);

    return [];
  }

  return safeParse.data;
}
