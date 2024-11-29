import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaccineRegistrationDto } from './dto/create-vaccine-registration.dto';
import { UpdateVaccineRegistrationDto } from './dto/update-vaccine-registration.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Status,
  VaccineRegistration,
} from './entities/vaccine-registration.entity';
import { VaccinationResultsService } from '../vaccination_results/vaccination_results.service';
import { PaginationResource } from 'src/common/types/pagination-response.dto';
import { Role } from 'src/common/enum/role.enum';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Gender, User } from '../users/entities/user.entity';
import { getWhere } from 'src/common/utils/getWhere';

@Injectable()
export class VaccineRegistrationsService {
  constructor(
    private vaccinationResultService: VaccinationResultsService,
    @InjectRepository(VaccineRegistration)
    private vaccineRegistrationRepository: Repository<VaccineRegistration>,
  ) {}
  async create(
    userId: number,
    createVaccineRegistrationDto: CreateVaccineRegistrationDto,
  ): Promise<VaccineRegistration> {
    return await this.vaccineRegistrationRepository.save({
      ...createVaccineRegistrationDto,
      user: { id: userId },
    });
  }

  async findAll(
    user: User,
    { limit, offset, page, size }: Pagination,
    filters: Record<string, string | number>,
  ): Promise<PaginationResource<Partial<VaccineRegistration>>> {
    const role: Role = user.role;
    const where = getWhere(filters);
    const whereConditions =
      role === Role.Admin ? { user: { ...where } } : { user: { id: user.id } };
    const [vaccineRegistrations, total] =
      await this.vaccineRegistrationRepository.findAndCount({
        where: whereConditions,
        relations: {
          user: true,
        },
        select: {
          user: { name: true, dob: true, gender: true, idCardNumber: true },
        },
        take: limit,
        skip: offset,
      });
    return {
      items: vaccineRegistrations,
      page,
      size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: number): Promise<VaccineRegistration> {
    const vaccineRegistration =
      await this.vaccineRegistrationRepository.findOneBy({ id });
    if (!vaccineRegistration)
      throw new NotFoundException(
        `Vaccine registration with ID ${id} not found!`,
      );
    return vaccineRegistration;
  }

  async update(
    id: number,
    updateVaccineRegistrationDto: UpdateVaccineRegistrationDto,
  ): Promise<VaccineRegistration> {
    const vaccineRegistration = await this.findOne(id);
    const status: Status = updateVaccineRegistrationDto.status;

    if (
      status === Status.COMPLETED &&
      vaccineRegistration.status !== Status.COMPLETED
    ) {
      await this.vaccinationResultService.create(id);
    } else await this.vaccinationResultService.remove(id);

    vaccineRegistration.status = status;

    return this.vaccineRegistrationRepository.save(vaccineRegistration);
  }
}
