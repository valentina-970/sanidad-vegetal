import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  type ErrorValidacion,
  lanzarSiHayErrores,
  parsearIdRuta,
  validarBodyNoVacio,
  validarFecha,
  validarId,
  validarIdTexto,
  validarTexto,
} from '../../common/validaciones.js';
import { ActualizarBroteDto } from './dto/actualizar-brote.dto.js';
import { CrearBroteDto } from './dto/crear-brote.dto.js';
import { BrotesService } from './brotes.service.js';

function validarHectareas(valor: unknown, campo: string): ErrorValidacion {
  if (valor === undefined || valor === null) {
    return `El campo ${campo} es obligatorio`;
  }
  if (typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
    return `El campo ${campo} debe ser un número mayor que cero`;
  }
  return null;
}

@ApiTags('brotes')
@Controller('brotes')
export class BrotesController {
  constructor(private readonly brotesService: BrotesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo brote de enfermedad' })
  @ApiBody({ type: CrearBroteDto })
  @ApiResponse({ status: 201, description: 'Brote registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Campo faltante, formato inválido, fecha futura o hectáreas inválidas' })
  @ApiResponse({ status: 404, description: 'No existe la planta o la enfermedad indicada' })
  crearBrote(@Body() dto: CrearBroteDto) {
    const datos = dto ?? ({} as CrearBroteDto);
    lanzarSiHayErrores([
      validarId(datos.plantaId, 'plantaId'),
      validarId(datos.enfermedadId, 'enfermedadId'),
      validarTexto(datos.region, 'region', 100),
      validarFecha(datos.fecha, 'fecha'),
      validarHectareas(datos.hectareas, 'hectareas'),
    ]);
    return this.brotesService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar brotes con filtros opcionales (por planta, enfermedad, región o rango de fechas)' })
  @ApiQuery({ name: 'plantaId', required: false, description: 'Id de la planta' })
  @ApiQuery({ name: 'enfermedadId', required: false, description: 'Id de la enfermedad' })
  @ApiQuery({ name: 'region', required: false, description: 'Filtro por región' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio en rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin en rango (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de brotes' })
  @ApiResponse({ status: 400, description: 'Un filtro o fecha es inválido' })
  obtenerBrotes(
    @Query('plantaId') plantaId?: string,
    @Query('enfermedadId') enfermedadId?: string,
    @Query('region') region?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const errores: ErrorValidacion[] = [];
    if (plantaId !== undefined) {
      errores.push(validarIdTexto(plantaId, 'plantaId'));
    }
    if (enfermedadId !== undefined) {
      errores.push(validarIdTexto(enfermedadId, 'enfermedadId'));
    }
    if (region !== undefined) {
      errores.push(validarTexto(region, 'region'));
    }
    if (fechaInicio !== undefined) {
      errores.push(validarFecha(fechaInicio, 'fechaInicio'));
    }
    if (fechaFin !== undefined) {
      errores.push(validarFecha(fechaFin, 'fechaFin'));
    }
    lanzarSiHayErrores(errores);

    return this.brotesService.listar(
      plantaId !== undefined ? Number(plantaId) : undefined,
      enfermedadId !== undefined ? Number(enfermedadId) : undefined,
      region,
      fechaInicio,
      fechaFin,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un brote por id' })
  @ApiParam({ name: 'id', description: 'Id del brote' })
  @ApiResponse({ status: 200, description: 'Brote encontrado' })
  @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
  @ApiResponse({ status: 404, description: 'No existe el brote' })
  obtenerBrote(@Param('id') id: string) {
    return this.brotesService.obtener(parsearIdRuta(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar parcialmente un brote' })
  @ApiParam({ name: 'id', description: 'Id del brote' })
  @ApiBody({ type: ActualizarBroteDto })
  @ApiResponse({ status: 200, description: 'Brote actualizado' })
  @ApiResponse({ status: 400, description: 'Id inválido, body vacío o campo inválido' })
  @ApiResponse({ status: 404, description: 'No existe el brote, la planta o la enfermedad' })
  actualizarBrote(@Param('id') id: string, @Body() dto: ActualizarBroteDto) {
    const idNumero = parsearIdRuta(id);
    validarBodyNoVacio(dto);

    const errores: ErrorValidacion[] = [];
    if (dto.plantaId !== undefined) {
      errores.push(validarId(dto.plantaId, 'plantaId'));
    }
    if (dto.enfermedadId !== undefined) {
      errores.push(validarId(dto.enfermedadId, 'enfermedadId'));
    }
    if (dto.region !== undefined) {
      errores.push(validarTexto(dto.region, 'region', 100));
    }
    if (dto.fecha !== undefined) {
      errores.push(validarFecha(dto.fecha, 'fecha'));
    }
    if (dto.hectareas !== undefined) {
      errores.push(validarHectareas(dto.hectareas, 'hectareas'));
    }
    lanzarSiHayErrores(errores);

    return this.brotesService.actualizar(idNumero, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un brote' })
  @ApiParam({ name: 'id', description: 'Id del brote' })
  @ApiResponse({ status: 200, description: 'Brote eliminado con mensaje de confirmación' })
  @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
  @ApiResponse({ status: 404, description: 'No existe el brote' })
  eliminarBrote(@Param('id') id: string) {
    return this.brotesService.eliminar(parsearIdRuta(id));
  }
}