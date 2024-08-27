import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCep } from './dto/return-cep.dto';
import { ResponsePriceCorreios } from './dto/response-price-correios';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get(':cep')
  async findAll(@Param('cep') cep: string): Promise<ReturnCep> {
    return this.correiosService.findAddressByCep(cep);
  }
}
