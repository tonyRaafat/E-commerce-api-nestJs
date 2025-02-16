import { MockModel } from '../../../database/test/mock.model';
import { orderStub } from '../stubs/order.stub';
import { Order } from '../../entities/order.entity';

export class OrderModel extends MockModel<Order> {
  protected entityStub = orderStub();

  constructor() {
    super(orderStub());
  }

  public findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(this.entityStub),
  });
}
