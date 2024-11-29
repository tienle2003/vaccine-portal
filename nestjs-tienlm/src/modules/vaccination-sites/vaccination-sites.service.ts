import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVaccinationSiteDto } from './dto/create-vaccination-site.dto';
import { UpdateVaccinationSiteDto } from './dto/update-vaccination-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VaccinationSite } from './entities/vaccination-site.entity';
import { ILike, Like, Repository } from 'typeorm';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { PaginationResource } from 'src/common/types/pagination-response.dto';
import { ProvincesService } from '../provinces/provinces.service';
import { DistrictsService } from '../districts/districts.service';
import { WardsService } from '../wards/wards.service';
import { getWhere } from 'src/common/utils/getWhere';

@Injectable()
export class VaccinationSitesService {
  constructor(
    private provincesService: ProvincesService,
    private districtsService: DistrictsService,
    private wardsService: WardsService,
    @InjectRepository(VaccinationSite)
    private vaccinationSiteRepository: Repository<VaccinationSite>,
  ) {}
  async create(
    createVaccinationSiteDto: CreateVaccinationSiteDto,
  ): Promise<VaccinationSite> {
    const { name, provinceId, districtId, wardId } = createVaccinationSiteDto;

    const existingVaccinationSite: VaccinationSite =
      await this.vaccinationSiteRepository.findOneBy({ name });
    if (existingVaccinationSite)
      throw new ConflictException('Vaccination site already exists');

    const province = await this.provincesService.findOne(provinceId);
    const district = await this.districtsService.findOne(districtId);
    const ward = await this.wardsService.findOne(wardId);

    const newVaccinationSite = await this.vaccinationSiteRepository.create({
      name,
      province,
      district,
      ward,
      ...createVaccinationSiteDto,
    });
    return await this.vaccinationSiteRepository.save(newVaccinationSite);
  }

  async findAll(
    { limit, offset, page, size }: Pagination,
    filters: Record<string, string | number>,
  ): Promise<PaginationResource<Partial<VaccinationSite>>> {
    const where = getWhere(filters);
    const [vaccinationSites, total] =
      await this.vaccinationSiteRepository.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        where: where,
        relations: ['province', 'district', 'ward'],
        take: limit,
        skip: offset,
      });

    return {
      items: vaccinationSites,
      page,
      size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: number): Promise<VaccinationSite> {
    const vaccinationSite = await this.vaccinationSiteRepository.findOne({
      where: { id },
      relations: ['province', 'district', 'ward'],
    });

    if (!vaccinationSite)
      throw new NotFoundException('Vaccination site not found!');

    return vaccinationSite;
  }

  async update(
    id: number,
    updateVaccinationSiteDto: UpdateVaccinationSiteDto,
  ): Promise<VaccinationSite> {
    const { name, provinceId, districtId, wardId, ...other } =
      updateVaccinationSiteDto;
    const vaccinationSite: VaccinationSite = await this.findOne(id);
    const vaccinationSiteName = await this.vaccinationSiteRepository
      .createQueryBuilder('vaccinationSite')
      .where('vaccinationSite.name = :name', { name })
      .andWhere('vaccinationSite.id != :id', { id })
      .getOne();
    if (vaccinationSiteName)
      throw new ConflictException('Vaccination site name already exist');

    provinceId &&
      (vaccinationSite.province =
        await this.provincesService.findOne(provinceId));
    districtId &&
      (vaccinationSite.district =
        await this.districtsService.findOne(districtId));
    wardId && (vaccinationSite.ward = await this.wardsService.findOne(wardId));

    Object.assign(vaccinationSite, { name, ...other });
    return await this.vaccinationSiteRepository.save(vaccinationSite);
  }
}
