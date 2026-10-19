import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  type ErrorValidacion,
  lanzarSiHayErrores,
  parsearIdRuta,
  validarBodyNoVacio,
  validarId,
  validarIdTexto,
  validarLista,
} from '../../common/validaciones.js';
import { ActualizarSusceptibilidadDto } from './dto/actualizar-susceptibilidad.dto.js';
import { CrearSusceptibilidadDto } from './dto/crear-susceptibilidad.dto.js';
import type { SusceptibilidadesServiceInterface } from './susceptibilidades-service-interface.js';
import { SUSCEPTIBILIDADES_SERVICE } from './tokens.js';

const NIVELES = ['baja', 'media', 'alta'];

@ApiTags('susceptibilidades')
@Controller('susceptibilidades')
export class SusceptibilidadesController {
  constructor(
    @Inject(SUSCEPTIBILIDADES_SERVICE)
    private readonly susceptibilidadesService: SusceptibilidadesServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar qué tan susceptible es una planta a una enfermedad' })
  @ApiBody({ type: CrearSusceptibilidadDto })
  @ApiResponse({ status: 201, description: 'Susceptibilidad creada' })
  @ApiResponse({ status: 400, description: 'Campo faltante, de tipo incorrecto o nivel no permitido' })
  @ApiResponse({ status: 404, description: 'No existe la planta o la enfermedad indicada' })
  @ApiResponse({ status: 409, description: 'Ya existe una susceptibilidad para esa planta y enfermedad' })
  crearSusceptibilidad(@Body() dto: CrearSusceptibilidadDto) {
    const datos = dto ?? ({} as CrearSusceptibilidadDto);
    lanzarSiHayErrores([
      validarId(datos.plantaId, 'plantaId'),
      validarId(datos.enfermedadId, 'enfermedadId'),
      validarLista(datos.nivel, 'nivel', NIVELES),
    ]);
    return this.susceptibilidadesService.crear(datos);
  }

  @Get()
  @ApiOperation({ summary: 'Listar susceptibilidades, con filtros opcionales' })
  @ApiQuery({ name: 'plantaId', required: false, description: 'Id de la planta' })
  @ApiQuery({ name: 'enfermedadId', required: false, description: 'Id de la enfermedad' })
  @ApiQuery({ name: 'nivel', required: false, description: 'Valores permitidos: baja, media, alta' })
  @ApiResponse({ status: 200, description: 'Lista de susceptibilidades' })
  @ApiResponse({ status: 400, description: 'Un filtro es inválido' })
  obtenerSusceptibilidades(
    @Query('plantaId') plantaId?: string,
    @Query('enfermedadId') enfermedadId?: string,
    @Query('nivel') nivel?: string,
  ) {
    const errores: ErrorValidacion[] = [];
    if (plantaId !== undefined) {
      errores.push(validarIdTexto(plantaId, 'plantaId'));
    }
    if (enfermedadId !== undefined) {
      errores.push(validarIdTexto(enfermedadId, 'enfermedadId'));
    }
    if (nivel !== undefined) {
      errores.push(validarLista(nivel, 'nivel', NIVELES));
    }
    lanzarSiHayErrores(errores);
    return this.susceptibilidadesService.listar(
      plantaId !== undefined ? Number(plantaId) : undefined,
      enfermedadId !== undefined ? Number(enfermedadId) : undefined,
      nivel,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una susceptibilidad por id' })
  @ApiParam({ name: 'id', description: 'Id de la susceptibilidad' })
  @ApiResponse({ status: 200, description: 'Susceptibilidad encontrada' })
  @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
  @ApiResponse({ status: 404, description: 'No existe la susceptibilidad' })
  obtenerSusceptibilidad(@Param('id') id: string) {
    return this.susceptibilidadesService.obtener(parsearIdRuta(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar parcialmente una susceptibilidad' })
  @ApiParam({ name: 'id', description: 'Id de la susceptibilidad' })
  @ApiBody({ type: ActualizarSusceptibilidadDto })
  @ApiResponse({ status: 200, description: 'Susceptibilidad actualizada' })
  @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
  @ApiResponse({ status: 404, description: 'No existe la susceptibilidad, la planta o la enfermedad' })
  @ApiResponse({ status: 409, description: 'La nueva combinación de planta y enfermedad ya existe' })
  actualizarSusceptibilidad(@Param('id') id: string, @Body() dto: ActualizarSusceptibilidadDto) {
    const idNumero = parsearIdRuta(id);
    validarBodyNoVacio(dto);

    const errores: ErrorValidacion[] = [];
    if (dto.plantaId !== undefined) {
      errores.push(validarId(dto.plantaId, 'plantaId'));
    }
    if (dto.enfermedadId !== undefined) {
      errores.push(validarId(dto.enfermedadId, 'enfermedadId'));
    }
    if (dto.nivel !== undefined) {
      errores.push(validarLista(dto.nivel, 'nivel', NIVELES));
    }
    lanzarSiHayErrores(errores);

    return this.susceptibilidadesService.actualizar(idNumero, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una susceptibilidad' })
  @ApiParam({ name: 'id', description: 'Id de la susceptibilidad' })
  @ApiResponse({ status: 200, description: 'Susceptibilidad eliminada, con mensaje de confirmación' })
  @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
  @ApiResponse({ status: 404, description: 'No existe la susceptibilidad' })
  eliminarSusceptibilidad(@Param('id') id: string) {
    return this.susceptibilidadesService.eliminar(parsearIdRuta(id));
  }
}
