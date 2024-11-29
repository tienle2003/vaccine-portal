import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VaccineRegistrationsService } from './vaccine-registrations.service';
import { CreateVaccineRegistrationDto } from './dto/create-vaccine-registration.dto';
import { UpdateVaccineRegistrationDto } from './dto/update-vaccine-registration.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserParams } from 'src/common/decorators/user.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { User } from '../users/entities/user.entity';
import { FilterParams } from 'src/common/decorators/filter-params.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('vaccine-registrations')
export class VaccineRegistrationsController {
  constructor(
    private readonly vaccineRegistrationsService: VaccineRegistrationsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @ResponseMessage('Create new vaccine registration successfully.')
  create(
    @UserParams() user: User,
    @Body() createVaccineRegistrationDto: CreateVaccineRegistrationDto,
  ) {
    return this.vaccineRegistrationsService.create(
      user.id,
      createVaccineRegistrationDto,
    );
  }

  @Get()
  @ApiBearerAuth()
  findAll(
    @UserParams() user: User,
    @PaginationParams() paginationParams: Pagination,
    @FilterParams(['name', 'idCardNumber'])
    filters: Record<string, string | number>,
  ) {
    return this.vaccineRegistrationsService.findAll(
      user,
      paginationParams,
      filters,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vaccineRegistrationsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ResponseMessage(`Vaccine registration updated successfully.`)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVaccineRegistrationDto: UpdateVaccineRegistrationDto,
  ) {
    return this.vaccineRegistrationsService.update(
      id,
      updateVaccineRegistrationDto,
    );
  }
}
