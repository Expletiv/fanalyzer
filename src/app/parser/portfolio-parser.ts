import {
  Client, ClientSchema
} from '../types/portfolio-performance';

export function parseClient(client: any): Client {
  return ClientSchema.parse(client);
}
