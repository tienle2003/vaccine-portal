import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProvincesModule } from '../provinces/provinces.module';
import { DistrictsModule } from '../districts/districts.module';
import { WardsModule } from '../wards/wards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProvincesModule,
    DistrictsModule,
    WardsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
