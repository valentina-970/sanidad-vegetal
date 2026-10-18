import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    type ErrorValidacion,
    lanzarSiHayErrores,
    parsearIdRuta,
    validarBodyNoVacio,
    validarId,
    validarIdTexto,
    validarLista,
    validarTexto,
} from '../../common/validaciones.js';
import { CrearEnfermedadDto } from './dto/crear-enfermedades.dto';
import { ActualizarEnfermedadDto } from './dto/actualizar-enfermedades.dto';
import { DetalleEnfermedadDto } from './dto/detalle-enfermedades.dto';
import { EnfermedadesService } from './enfermedades.service';

const EPOCAS_RIESGO = ['primavera', 'verano', 'otono', 'invierno', 'todo_el_anio'];

@ApiTags('enfermedades')
@Controller('enfermedades')
export class EnfermedadesController {
    constructor(private readonly enfermedadesService: EnfermedadesService) {}

    @Post('')
    @ApiOperation({ summary: 'Crear una enfermedad' })
    @ApiBody({ type: CrearEnfermedadDto })
    @ApiResponse({ status: 201, description: 'Enfermedad creada' })
    @ApiResponse({ status: 400, description: 'Campo faltante, vacío, de tipo incorrecto o valor no permitido' })
    @ApiResponse({ status: 404, description: 'No existe el patógeno indicado' })
    crearEnfermedad(@Body() dto: CrearEnfermedadDto) {
        const datos = dto ?? ({} as CrearEnfermedadDto);
        lanzarSiHayErrores([
            validarTexto(datos.nombre, 'nombre', 100),
            validarTexto(datos.sintomas, 'sintomas'),
            validarLista(datos.epocaRiesgo, 'epocaRiesgo', EPOCAS_RIESGO),
            validarId(datos.patogenoId, 'patogenoId'),
        ]);
        return this.enfermedadesService.crear(datos);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar una enfermedad por id' })
    @ApiParam({ name: 'id', description: 'Id de la enfermedad' })
    @ApiResponse({ status: 200, description: 'Enfermedad encontrada' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la enfermedad' })
    obtenerEnfermedad(@Param('id') id: string) {
        return this.enfermedadesService.obtener(parsearIdRuta(id));
    }
    @Get(':id/detalle')
    @ApiOperation({ summary: 'Detalle de una enfermedad: su patógeno y todos sus tratamientos' })
    @ApiParam({ name: 'id', description: 'Id de la enfermedad' })
    @ApiResponse({ status: 200, description: 'Detalle de la enfermedad', type: DetalleEnfermedadDto })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la enfermedad' })
    obtenerDetalleEnfermedad(@Param('id') id: string) {
        return this.enfermedadesService.obtenerDetalle(parsearIdRuta(id));
    }

    @Get('')
    @ApiOperation({ summary: 'Listar enfermedades, con filtros opcionales' })
    @ApiQuery({ name: 'epocaRiesgo', required: false, description: 'Valores permitidos: primavera, verano, otono, invierno, todo_el_anio' })
    @ApiQuery({ name: 'patogenoId', required: false, description: 'Id del patógeno que causa la enfermedad' })
    @ApiResponse({ status: 200, description: 'Lista de enfermedades' })
    @ApiResponse({ status: 400, description: 'Un filtro tiene un valor no permitido' })
    obtenerEnfermedades(@Query('epocaRiesgo') epocaRiesgo?: string, @Query('patogenoId') patogenoId?: string) {
        const errores: ErrorValidacion[] = [];
        if (epocaRiesgo !== undefined) {
            errores.push(validarLista(epocaRiesgo, 'epocaRiesgo', EPOCAS_RIESGO));
        }
        if (patogenoId !== undefined) {
            errores.push(validarIdTexto(patogenoId, 'patogenoId'));
        }
        lanzarSiHayErrores(errores);
        return this.enfermedadesService.listar(epocaRiesgo, patogenoId !== undefined ? Number(patogenoId) : undefined);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una enfermedad' })
    @ApiParam({ name: 'id', description: 'Id de la enfermedad' })
    @ApiResponse({ status: 200, description: 'Enfermedad eliminada, con mensaje de confirmación' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la enfermedad' })
    eliminarEnfermedad(@Param('id') id: string) {
        return this.enfermedadesService.eliminar(parsearIdRuta(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar parcialmente una enfermedad' })
    @ApiParam({ name: 'id', description: 'Id de la enfermedad' })
    @ApiBody({ type: ActualizarEnfermedadDto })
    @ApiResponse({ status: 200, description: 'Enfermedad actualizada' })
    @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
    @ApiResponse({ status: 404, description: 'No existe la enfermedad o el patógeno indicado' })
    actualizarEnfermedad(@Param('id') id: string, @Body() dto: ActualizarEnfermedadDto) {
        const idNumero = parsearIdRuta(id);
        validarBodyNoVacio(dto);

        const errores: ErrorValidacion[] = [];
        if (dto.nombre !== undefined) {
            errores.push(validarTexto(dto.nombre, 'nombre', 100));
        }
        if (dto.sintomas !== undefined) {
            errores.push(validarTexto(dto.sintomas, 'sintomas'));
        }
        if (dto.epocaRiesgo !== undefined) {
            errores.push(validarLista(dto.epocaRiesgo, 'epocaRiesgo', EPOCAS_RIESGO));
        }
        if (dto.patogenoId !== undefined) {
            errores.push(validarId(dto.patogenoId, 'patogenoId'));
        }
        lanzarSiHayErrores(errores);

        return this.enfermedadesService.actualizar(idNumero, dto);
    }
}
