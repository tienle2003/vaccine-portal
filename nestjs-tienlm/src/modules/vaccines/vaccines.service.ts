import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VaccinesService {
  constructor(
    @InjectRepository(Vaccine)
    private vaccineRepository: Repository<Vaccine>,
  ) {}
  async create(createVaccineDto: CreateVaccineDto): Promise<Vaccine> {
    const { name } = createVaccineDto;
    const vaccine = await this.vaccineRepository.findOneBy({ name });
    if (vaccine)
      throw new ConflictException(
        `Vaccince with name ${name} already existing`,
      );
    return await this.vaccineRepository.save(createVaccineDto);
  }

  async findOne(id: number): Promise<Vaccine> {
    const vaccination = await this.vaccineRepository.findOne({
      where: { id },
    });

    if (!vaccination)
      throw new NotFoundException('Vaccination site not found!');

    return vaccination;
  }

  async findAll(): Promise<Vaccine[]> {
    return await this.vaccineRepository.find();
  }
}
