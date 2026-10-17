import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SusceptibilidadesService } from './susceptibilidades.service';
import { CreateSusceptibilidadeDto } from './dto/create-susceptibilidade.dto';
import { UpdateSusceptibilidadeDto } from './dto/update-susceptibilidade.dto';

@ApiTags('susceptibilidades')
@Controller('susceptibilidades')
export class SusceptibilidadesController {
  constructor(private readonly susceptibilidadesService: SusceptibilidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva susceptibilidad'})
  create(@Body() createDto: CreateSusceptibilidadeDto) {
    return this.susceptibilidadesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las susceptibilidades'})
  findAll() {
    return this.susceptibilidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una susceptibilidad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.susceptibilidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una susceptibilidad por ID'})
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateSusceptibilidadeDto,
  ){
    return this.susceptibilidadesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una susceptibilidad por ID'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.susceptibilidadesService.remove(id);
  }
}
