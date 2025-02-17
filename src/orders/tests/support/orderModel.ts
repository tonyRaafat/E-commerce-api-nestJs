import { MockModel } from '../../../database/test/mock.model';
import { orderStub } from '../stubs/order.stub';
import { Order } from '../../entities/order.entity';

export class OrderModel extends MockModel<Order> {
  protected entityStub = orderStub();

  // public insertMany(entities: Order[]): Promise<Order[]> {
  //   return super.insertMany(entities);
  // }
  public findOne = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(this.entityStub),
  });

  public find = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([this.entityStub]),
  });

  public countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(1),
  });

  // public deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
}
