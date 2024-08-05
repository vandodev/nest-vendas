import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CacheModule.register({
      ttl: 900000000,
    }),
    TypeOrmModule.forFeature([CityEntity]),
  ],
  controllers: [CityController],
  providers: [CityService]
})
export class CityModule {}
