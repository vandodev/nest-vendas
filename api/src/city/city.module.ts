import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
// import { CacheModule } from '@nestjs/cache-manager';
import { CacheModule } from '../cache/cache.module';
import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([CityEntity])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
