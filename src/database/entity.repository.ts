import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findById(
    id: any,
    projection?: Record<string, unknown>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findById(id, projection, options).exec();
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async findOneAndPopulate(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T[] | null> {
    return this.entityModel.find(filterQuery, projection).exec();
  }

  async create(createEntityModel: unknown): Promise<T | T[]> {
    if (Array.isArray(createEntityModel)) {
      return this.entityModel.insertMany(createEntityModel);
    } else {
      const entity = new this.entityModel(createEntityModel);
      return entity.save();
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityModel: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return this.entityModel
      .findOneAndUpdate(filterQuery, updateEntityModel, options)
      .exec();
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const res = await this.entityModel.deleteMany(filterQuery).exec();
    return res.deletedCount >= 1;
  }
}
