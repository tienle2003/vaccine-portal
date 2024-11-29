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
import { VaccinationSitesService } from './vaccination-sites.service';
import { CreateVaccinationSiteDto } from './dto/create-vaccination-site.dto';
import { UpdateVaccinationSiteDto } from './dto/update-vaccination-site.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { FilterParams } from 'src/common/decorators/filter-params.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('vaccination-sites')
export class VaccinationSitesController {
  constructor(
    private readonly vaccinationSitesService: VaccinationSitesService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ResponseMessage('Create new vaccination site successfully.')
  create(@Body() createVaccinationSiteDto: CreateVaccinationSiteDto) {
    return this.vaccinationSitesService.create(createVaccinationSiteDto);
  }

  @Get()
  @Public()
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @FilterParams(['province', 'district', 'ward'])
    filters: Record<string, string | number>,
  ) {
    return this.vaccinationSitesService.findAll(paginationParams, filters);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.vaccinationSitesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVaccinationSiteDto: UpdateVaccinationSiteDto,
  ) {
    return this.vaccinationSitesService.update(id, updateVaccinationSiteDto);
  }
}
