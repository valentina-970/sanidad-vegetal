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
import { CrearTratamientoDto } from './dto/crear-tratamientos.dto.js';
import { ActualizarTratamientoDto } from './dto/actualizar-tratamientos.dto.js';
import { TratamientosService } from './tratamientos.service.js';

const TIPOS_TRATAMIENTO = ['quimico', 'biologico', 'cultural'];

@ApiTags('tratamientos')
@Controller('tratamientos')
export class TratamientosController {
    constructor(private readonly tratamientosService: TratamientosService) {}

    @Post('')
    @ApiOperation({ summary: 'Crear un tratamiento' })
    @ApiBody({ type: CrearTratamientoDto })
    @ApiResponse({ status: 201, description: 'Tratamiento creado' })
    @ApiResponse({ status: 400, description: 'Campo faltante, vacío, de tipo incorrecto o valor no permitido' })
    @ApiResponse({ status: 404, description: 'No existe la enfermedad indicada' })
    crearTratamiento(@Body() dto: CrearTratamientoDto) {
        const datos = dto ?? ({} as CrearTratamientoDto);
        lanzarSiHayErrores([
            validarTexto(datos.nombre, 'nombre', 100),
            validarTexto(datos.descripcionAplicacion, 'descripcionAplicacion'),
            validarLista(datos.tipo, 'tipo', TIPOS_TRATAMIENTO),
            validarId(datos.enfermedadId, 'enfermedadId'),
        ]);
        return this.tratamientosService.crear(datos);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar un tratamiento por id' })
    @ApiParam({ name: 'id', description: 'Id del tratamiento' })
    @ApiResponse({ status: 200, description: 'Tratamiento encontrado' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el tratamiento' })
    obtenerTratamiento(@Param('id') id: string) {
        return this.tratamientosService.obtener(parsearIdRuta(id));
    }

    @Get('')
    @ApiOperation({ summary: 'Listar tratamientos, con filtros opcionales' })
    @ApiQuery({ name: 'tipo', required: false, description: 'Valores permitidos: quimico, biologico, cultural' })
    @ApiQuery({ name: 'enfermedadId', required: false, description: 'Id de la enfermedad que se trata' })
    @ApiResponse({ status: 200, description: 'Lista de tratamientos' })
    @ApiResponse({ status: 400, description: 'Un filtro tiene un valor no permitido' })
    obtenerTratamientos(@Query('tipo') tipo?: string, @Query('enfermedadId') enfermedadId?: string) {
        const errores: ErrorValidacion[] = [];
        if (tipo !== undefined) {
            errores.push(validarLista(tipo, 'tipo', TIPOS_TRATAMIENTO));
        }
        if (enfermedadId !== undefined) {
            errores.push(validarIdTexto(enfermedadId, 'enfermedadId'));
        }
        lanzarSiHayErrores(errores);
        return this.tratamientosService.listar(tipo, enfermedadId !== undefined ? Number(enfermedadId) : undefined);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un tratamiento' })
    @ApiParam({ name: 'id', description: 'Id del tratamiento' })
    @ApiResponse({ status: 200, description: 'Tratamiento eliminado, con mensaje de confirmación' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el tratamiento' })
    eliminarTratamiento(@Param('id') id: string) {
        return this.tratamientosService.eliminar(parsearIdRuta(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar parcialmente un tratamiento' })
    @ApiParam({ name: 'id', description: 'Id del tratamiento' })
    @ApiBody({ type: ActualizarTratamientoDto })
    @ApiResponse({ status: 200, description: 'Tratamiento actualizado' })
    @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
    @ApiResponse({ status: 404, description: 'No existe el tratamiento o la enfermedad indicada' })
    actualizarTratamiento(@Param('id') id: string, @Body() dto: ActualizarTratamientoDto) {
        const idNumero = parsearIdRuta(id);
        validarBodyNoVacio(dto);

        const errores: ErrorValidacion[] = [];
        if (dto.nombre !== undefined) {
            errores.push(validarTexto(dto.nombre, 'nombre', 100));
        }
        if (dto.descripcionAplicacion !== undefined) {
            errores.push(validarTexto(dto.descripcionAplicacion, 'descripcionAplicacion'));
        }
        if (dto.tipo !== undefined) {
            errores.push(validarLista(dto.tipo, 'tipo', TIPOS_TRATAMIENTO));
        }
        if (dto.enfermedadId !== undefined) {
            errores.push(validarId(dto.enfermedadId, 'enfermedadId'));
        }
        lanzarSiHayErrores(errores);

        return this.tratamientosService.actualizar(idNumero, dto);
    }
}

