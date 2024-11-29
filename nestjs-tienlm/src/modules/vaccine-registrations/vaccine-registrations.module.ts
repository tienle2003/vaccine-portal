import { Module } from '@nestjs/common';
import { VaccineRegistrationsService } from './vaccine-registrations.service';
import { VaccineRegistrationsController } from './vaccine-registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccineRegistration } from './entities/vaccine-registration.entity';
import { VaccinationResultsModule } from '../vaccination_results/vaccination_results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VaccineRegistration]),
    VaccinationResultsModule,
  ],
  controllers: [VaccineRegistrationsController],
  providers: [VaccineRegistrationsService],
})
export class VaccineRegistrationsModule {}
