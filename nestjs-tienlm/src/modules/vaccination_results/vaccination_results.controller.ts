import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { VaccinationResultsService } from './vaccination_results.service';
import { UpdateVaccinationResultDto } from './dto/update-vaccination_result.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserParams } from 'src/common/decorators/user.decorator';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('vaccination-results')
export class VaccinationResultsController {
  constructor(
    private readonly vaccinationResultsService: VaccinationResultsService,
  ) {}

  @Get()
  findAll(
    @UserParams() user: User,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const userId = user.id;
    return this.vaccinationResultsService.findAll(userId, paginationParams);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateVaccinationResultDto: UpdateVaccinationResultDto,
  ) {
    return this.vaccinationResultsService.update(
      +id,
      updateVaccinationResultDto,
    );
  }
}
