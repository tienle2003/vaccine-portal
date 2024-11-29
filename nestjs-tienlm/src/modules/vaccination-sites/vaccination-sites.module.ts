import { Module } from '@nestjs/common';
import { VaccinationSitesService } from './vaccination-sites.service';
import { VaccinationSitesController } from './vaccination-sites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationSite } from './entities/vaccination-site.entity';
import { ProvincesModule } from '../provinces/provinces.module';
import { DistrictsModule } from '../districts/districts.module';
import { WardsModule } from '../wards/wards.module';

@Module({
  imports: [
    ProvincesModule,
    DistrictsModule,
    WardsModule,
    TypeOrmModule.forFeature([VaccinationSite]),
  ],
  controllers: [VaccinationSitesController],
  providers: [VaccinationSitesService],
  exports: [VaccinationSitesService],
})
export class VaccinationSitesModule {}
