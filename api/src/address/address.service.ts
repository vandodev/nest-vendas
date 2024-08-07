import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
        private readonly userService: UserService,
    ) {}

    async createAddress(
        createAddressDto: CreateAddressDto,
        userId: number,
      ): Promise<AddressEntity> {
        await this.userService.findUserById(userId);
        return this.addressRepository.save({
          ...createAddressDto,
          userId,
        });
      }
}
