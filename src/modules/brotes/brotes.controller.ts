import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  type ErrorValidacion,
  lanzarSiHayErrores,
  parsearIdRuta,
  validarBodyNoVacio,
  validarFecha,
  validarFormatoFecha,
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
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    return `El campo ${campo} debe ser un número mayor que cero`;
  }
  if (valor > 99999999.99) {
    return `El campo ${campo} no puede ser mayor que 99999999.99`;
  }
  return null;
}

function validarRangoFechas(desde?: string, hasta?: string): ErrorValidacion[] {
  const errorDesde = desde === undefined ? null : validarFormatoFecha(desde, 'desde');
  const errorHasta = hasta === undefined ? null : validarFormatoFecha(hasta, 'hasta');
  const errores: ErrorValidacion[] = [errorDesde, errorHasta];
  if (desde !== undefined && hasta !== undefined && !errorDesde && !errorHasta && desde > hasta) {
    errores.push(`El filtro desde (${desde}) no puede ser posterior a hasta (${hasta})`);
  }
  return errores;
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
      validarHectareas(datos.hectareasAfectadas, 'hectareasAfectadas'),
    ]);
    return this.brotesService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar brotes con filtros opcionales (por planta, enfermedad, región o rango de fechas)' })
  @ApiQuery({ name: 'plantaId', required: false, description: 'Id de la planta' })
  @ApiQuery({ name: 'enfermedadId', required: false, description: 'Id de la enfermedad' })
  @ApiQuery({ name: 'region', required: false, description: 'Busca dentro de la región' })
  @ApiQuery({ name: 'desde', required: false, description: 'Fecha mínima del brote (YYYY-MM-DD)' })
  @ApiQuery({ name: 'hasta', required: false, description: 'Fecha máxima del brote (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de brotes' })
  @ApiResponse({ status: 400, description: 'Un filtro es inválido o desde es posterior a hasta' })
  obtenerBrotes(
    @Query('plantaId') plantaId?: string,
    @Query('enfermedadId') enfermedadId?: string,
    @Query('region') region?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
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
    errores.push(...validarRangoFechas(desde, hasta));
    lanzarSiHayErrores(errores);

    return this.brotesService.listar(
      plantaId !== undefined ? Number(plantaId) : undefined,
      enfermedadId !== undefined ? Number(enfermedadId) : undefined,
      region,
      desde,
      hasta,
    );
  }

  @Get('detalle')
  @ApiOperation({ summary: 'Brotes con el nombre de la planta, la enfermedad y el patógeno' })
  @ApiQuery({ name: 'region', required: false, description: 'Busca dentro de la región' })
  @ApiQuery({ name: 'desde', required: false, description: 'Fecha mínima del brote (YYYY-MM-DD)' })
  @ApiQuery({ name: 'hasta', required: false, description: 'Fecha máxima del brote (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Brotes con nombres de planta, enfermedad y patógeno' })
  @ApiResponse({ status: 400, description: 'Un filtro es inválido o desde es posterior a hasta' })
  obtenerBrotesDetalle(
    @Query('region') region?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const errores: ErrorValidacion[] = [];
    if (region !== undefined) {
      errores.push(validarTexto(region, 'region'));
    }
    errores.push(...validarRangoFechas(desde, hasta));
    lanzarSiHayErrores(errores);

    return this.brotesService.listarDetalle(region, desde, hasta);
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
    if (dto.hectareasAfectadas !== undefined) {
      errores.push(validarHectareas(dto.hectareasAfectadas, 'hectareasAfectadas'));
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