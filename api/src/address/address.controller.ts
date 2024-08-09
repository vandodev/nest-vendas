import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { Roles } from '../decorators/roles.decorator';
  import { UserType } from '../user/enum/user-type.enum';
  import { AddressService } from './address.service';
  import { CreateAddressDto } from './dtos/createAddress.dto';
  import { AddressEntity } from './entities/address.entity';
  import { UserId } from '../decorators/user-id.decorator';

@Roles(UserType.Admin)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createAddress(
      @Body() createAddressDto: CreateAddressDto,
      @UserId() userId: number,
    ): Promise<AddressEntity> {
      // console.log('DTO:', createAddressDto);
      return this.addressService.createAddress(createAddressDto, userId);
    }
}
