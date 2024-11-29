import { Module } from '@nestjs/common';
import { VaccinationResultsService } from './vaccination_results.service';
import { VaccinationResultsController } from './vaccination_results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationResult } from './entities/vaccination_result.entity';
import { VaccinationSitesModule } from '../vaccination-sites/vaccination-sites.module';
import { VaccinesModule } from '../vaccines/vaccines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VaccinationResult]),
    VaccinationSitesModule,
    VaccinesModule,
  ],
  controllers: [VaccinationResultsController],
  providers: [VaccinationResultsService],
  exports: [VaccinationResultsService],
})
export class VaccinationResultsModule {}
