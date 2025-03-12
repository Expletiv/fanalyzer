import { Client, ClientData, ClientDataSchema, ClientSchema } from '../types/portfolio-performance';

export function parseClient(client: any): Client {
  return ClientSchema.parse(client);
}

export function parseClientData(clientData: any): ClientData {
  return ClientDataSchema.parse(clientData);
}

export function getIndexedClient(client: any): Map<number, object> {
  return indexObjects(getObjectsRecursive(client));
}

function getObjectsRecursive(client: any): object[] {
  const objects: object[] = [];

  // Handle arrays
  if (Array.isArray(client)) {
    for (const item of client) {
      objects.push(...getObjectsRecursive(item));
    }

    return objects;
  }

  if (typeof client !== 'object') {
    return [];
  }

  // Handle objects
  for (const key in client) {
    if (typeof client[key] === 'object') {
      objects.push(client[key]);
      objects.push(...getObjectsRecursive(client[key]));
    }

    if (Array.isArray(client[key])) {
      for (const item of client[key]) {
        objects.push(...getObjectsRecursive(item));
      }
    }
  }

  return objects;
}

function indexObjects(objects: object[]): Map<number, object> {
  const objectMap = new Map<number, object>();

  for (const object of objects) {
    if ('id' in object && typeof object.id === 'number') {
      objectMap.set(object.id, object);
    }
  }

  return objectMap;
}
