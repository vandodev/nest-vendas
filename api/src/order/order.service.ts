import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentEntity } from 'src/payment/entities/payment.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(
    createOrderDTO: CreateOrderDTO,
    cartId: number,
    userId: number,
  ) {
    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDTO,
    );
    
    const order = await this.orderRepository.save({
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });    

    return null;
  }
}
