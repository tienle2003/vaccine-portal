import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { PaginationResource } from 'src/common/types/pagination-response.dto';
import { ProvincesService } from '../provinces/provinces.service';
import { DistrictsService } from '../districts/districts.service';
import { WardsService } from '../wards/wards.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private provincesService: ProvincesService,
    private districtsService: DistrictsService,
    private wardsService: WardsService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, idCardNumber, provinceId, districtId, wardId } =
      createUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) throw new ConflictException('Email already exists!');
    const existingIdCardNumber = await this.userRepository.findOneBy({
      idCardNumber,
    });
    if (existingIdCardNumber)
      throw new ConflictException('IdCardNumber already exists!');
    const province = await this.provincesService.findOne(provinceId);
    const district = await this.districtsService.findOne(districtId);
    const ward = await this.wardsService.findOne(wardId);
    const newUser = this.userRepository.create({
      ...createUserDto,
      province,
      district,
      ward,
    });
    return this.userRepository.save(newUser);
  }

  async findAll({
    limit,
    offset,
    page,
    size,
  }: Pagination): Promise<PaginationResource<Partial<User>>> {
    const [users, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      relations: ['province', 'district', 'ward'],
      take: limit,
      skip: offset,
    });
    return {
      items: users,
      page,
      size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['province', 'district', 'ward'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { provinceId, districtId, wardId, healthInsuranceNumber, ...other } =
      updateUserDto;
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    if (healthInsuranceNumber) {
      const existingUser = await this.userRepository.findOneBy({
        healthInsuranceNumber,
      });
      if (existingUser)
        throw new ConflictException('healthInsuranceNumber already existing');
    }
    if (provinceId) {
      user.province = await this.provincesService.findOne(provinceId);
    }
    if (districtId) {
      user.district = await this.districtsService.findOne(districtId);
    }
    if (wardId) {
      user.ward = await this.wardsService.findOne(wardId);
    }
    Object.assign(user, other);
    return await this.userRepository.save(user);
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Current password incorrect');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneByResetToken(resetToken: string): Promise<User> {
    return await this.userRepository.findOneBy({ resetToken });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
