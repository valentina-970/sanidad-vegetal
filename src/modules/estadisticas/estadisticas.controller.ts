import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type ErrorValidacion, lanzarSiHayErrores, validarFormatoFecha } from '../../common/validaciones.js';
import { EstadisticaBrotesDto } from './dto/estadistica-brotes.dto.js';
import { EstadisticasService } from './estadisticas.service.js';

function validarRango(desde?: string, hasta?: string): void {
  const errorDesde = desde === undefined ? null : validarFormatoFecha(desde, 'desde');
  const errorHasta = hasta === undefined ? null : validarFormatoFecha(hasta, 'hasta');
  const errores: ErrorValidacion[] = [errorDesde, errorHasta];
  if (desde !== undefined && hasta !== undefined && !errorDesde && !errorHasta && desde > hasta) {
    errores.push(`El filtro desde (${desde}) no puede ser posterior a hasta (${hasta})`);
  }
  lanzarSiHayErrores(errores);
}

@ApiTags('estadisticas')
@ApiQuery({ name: 'desde', required: false, description: 'Fecha mínima del brote (YYYY-MM-DD)' })
@ApiQuery({ name: 'hasta', required: false, description: 'Fecha máxima del brote (YYYY-MM-DD)' })
@ApiResponse({ status: 400, description: 'Fecha con formato inválido o desde posterior a hasta' })
@Controller('estadisticas/brotes')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('por-enfermedad')
  @ApiOperation({ summary: 'Total de brotes y hectáreas por enfermedad, de mayor a menor' })
  @ApiResponse({ status: 200, type: [EstadisticaBrotesDto] })
  porEnfermedad(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    validarRango(desde, hasta);
    return this.estadisticasService.porEnfermedad(desde, hasta);
  }

  @Get('por-patogeno')
  @ApiOperation({ summary: 'Total de brotes y hectáreas por patógeno, de mayor a menor' })
  @ApiResponse({ status: 200, type: [EstadisticaBrotesDto] })
  porPatogeno(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    validarRango(desde, hasta);
    return this.estadisticasService.porPatogeno(desde, hasta);
  }

  @Get('por-region')
  @ApiOperation({ summary: 'Total de brotes y hectáreas por región, de mayor a menor' })
  @ApiResponse({ status: 200, type: [EstadisticaBrotesDto] })
  porRegion(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    validarRango(desde, hasta);
    return this.estadisticasService.porRegion(desde, hasta);
  }

  @Get('por-tipo-cultivo')
  @ApiOperation({ summary: 'Total de brotes y hectáreas por tipo de cultivo, de mayor a menor' })
  @ApiResponse({ status: 200, type: [EstadisticaBrotesDto] })
  porTipoCultivo(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    validarRango(desde, hasta);
    return this.estadisticasService.porTipoCultivo(desde, hasta);
  }

  @Get('por-mes')
  @ApiOperation({ summary: 'Total de brotes y hectáreas por año y mes, en orden cronológico' })
  @ApiResponse({ status: 200, type: [EstadisticaBrotesDto] })
  porMes(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    validarRango(desde, hasta);
    return this.estadisticasService.porMes(desde, hasta);
  }
}
