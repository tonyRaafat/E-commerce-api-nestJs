/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  // Basic query methods
  findOne(filterQuery?: any): { exec: () => T } {
    return { exec: (): T => this.entityStub };
  }

  find(filterQuery?: any): { exec: () => T[] } {
    return { exec: (): T[] => [this.entityStub] };
  }

  findById(id: string): this {
    return this;
  }

  // Population methods
  populate(path: string, select?: string): this {
    return this;
  }

  // Update methods
  findOneAndUpdate(filterQuery: any, update: any, options?: any): this {
    return this;
  }

  // Delete methods
  deleteMany(filterQuery?: any): Promise<{ deletedCount: number }> {
    return Promise.resolve({ deletedCount: 1 });
  }

  // Creation methods
  insertMany(entities: T[]): Promise<T[]> {
    return Promise.resolve(entities);
  }

  save(): Promise<T> {
    return Promise.resolve(this.entityStub);
  }

  // Execution and projection
  select(projection: any): this {
    return this;
  }

  exec(): Promise<any> {
    if (Array.isArray(this.entityStub)) {
      return Promise.resolve([this.entityStub]);
    }
    return Promise.resolve(this.entityStub);
  }
}
