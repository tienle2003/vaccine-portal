import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VaccinationResult } from './entities/vaccination_result.entity';
import { Repository } from 'typeorm';
import { UpdateVaccinationResultDto } from './dto/update-vaccination_result.dto';
import { VaccinationSitesService } from '../vaccination-sites/vaccination-sites.service';
import { VaccinesService } from '../vaccines/vaccines.service';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';

@Injectable()
export class VaccinationResultsService {
  constructor(
    private vaccinationSitesService: VaccinationSitesService,
    private vaccinesService: VaccinesService,
    @InjectRepository(VaccinationResult)
    private vaccinationResultRepository: Repository<VaccinationResult>,
  ) {}
  async create(vaccineRegistrationId: number) {
    return await this.vaccinationResultRepository.save({
      vaccineRegistration: {
        id: vaccineRegistrationId,
      },
    });
  }

  async findAll(userId: number, { limit, offset, page, size }: Pagination) {
    const [vaccinationResults, total] =
      await this.vaccinationResultRepository.findAndCount({
        where: {
          vaccineRegistration: { user: { id: userId } },
          isInjected: true,
        },
        relations: ['vaccine', 'vaccinationSite'],
        select: { vaccinationSite: { name: true } },
        take: limit,
        skip: offset,
      });
    return {
      items: vaccinationResults,
      page,
      size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async remove(vaccineRegistrationId: number) {
    return await this.vaccinationResultRepository.delete({
      vaccineRegistration: {
        id: vaccineRegistrationId,
      },
    });
  }

  async update(
    id: number,
    updateVaccinationResultDto: UpdateVaccinationResultDto,
  ) {
    const { vaccinationSiteId, vaccineId, ...others } =
      updateVaccinationResultDto;
    const vaccinationResult = await this.vaccinationResultRepository.findOneBy({
      id,
    });
    if (!vaccinationResult)
      throw new NotFoundException(`VaccinationResult with ID ${id} not found`);

    vaccinationResult.vaccinationSite =
      await this.vaccinationSitesService.findOne(vaccinationSiteId);

    vaccinationResult.vaccine = await this.vaccinesService.findOne(vaccineId);

    Object.assign(vaccinationResult, others);

    return await this.vaccinationResultRepository.save(vaccinationResult);
  }
}
