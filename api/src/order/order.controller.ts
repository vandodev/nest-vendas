import {
    Body,
    Controller,
    Get,
    Post,
    UsePipes,
    ValidationPipe,
    Param,
  } from '@nestjs/common';
  import { CreateOrderDTO } from './dtos/create-order.dto';
  import { OrderService } from './order.service';
  import { UserId } from '../decorators/user-id.decorator';
  import { OrderEntity } from './entities/order.entity';
  import { Roles } from '../decorators/roles.decorator';
  import { UserType } from '../user/enum/user-type.enum';
  import { ReturnOrderDTO } from './dtos/return-order.dto';
  
  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Controller('order')
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    @Post()
    @UsePipes(ValidationPipe)
    async createOrder(
      @Body() createOrderDTO: CreateOrderDTO,
      @UserId() userId: number,
    ): Promise<OrderEntity> {
      return this.orderService.createOrder(createOrderDTO,userId);
    }

    @Get()
    async findOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
      return this.orderService.findOrdersByUserId(userId);
    }

    @Roles(UserType.Admin, UserType.Root)
    @Get('/all')
    async findAllOrders(): Promise<ReturnOrderDTO[]> {
      return (await this.orderService.findAllOrders()).map(
        (order) => new ReturnOrderDTO(order),
      );
    }

    @Roles(UserType.Admin, UserType.Root)
    @Get('/:orderId')
    async findOrderById(
      @Param('orderId') orderId: number,
    ): Promise<ReturnOrderDTO> {
      return new ReturnOrderDTO(
        (await this.orderService.findOrdersByUserId(undefined, orderId))[0],
      );
    }
  }
