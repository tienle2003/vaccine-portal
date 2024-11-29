import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VaccinesService } from './vaccines.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('vaccines')
export class VaccinesController {
  constructor(private readonly vaccinesService: VaccinesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() createVaccineDto: CreateVaccineDto) {
    return this.vaccinesService.create(createVaccineDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.vaccinesService.findAll();
  }
}
