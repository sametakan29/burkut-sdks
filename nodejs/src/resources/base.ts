import type { BurkutClient } from '../client';

export abstract class BaseResource {
  protected readonly client: BurkutClient;

  constructor(client: BurkutClient) {
    this.client = client;
  }

  protected _get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.client.request<T>('GET', endpoint, params);
  }
}
