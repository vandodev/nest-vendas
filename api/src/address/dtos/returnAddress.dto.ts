import { AddressEntity } from '../entities/address.entity';
import { ReturnCityDto } from '../../city/dtos/returnCity.dto';

export class ReturnAddressDto {
  id: number;
  complement: string;
  numberAddress: number;
  cep: string;
  city?: ReturnCityDto;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDto(address.city) : undefined;
  }
}