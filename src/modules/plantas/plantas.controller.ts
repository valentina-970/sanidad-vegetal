import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    type ErrorValidacion,
    lanzarSiHayErrores,
    parsearIdRuta,
    validarBodyNoVacio,
    validarLista,
    validarSecuencia,
    validarTexto,
} from '../../common/validaciones.js';
import { ActualizarPlantaDto } from './dto/actualizar-planta.dto.js';
import { CrearPlantaDto } from './dto/crear-planta.dto.js';
import { PlantasService } from './plantas.service.js';
import { FichaPlantaDto } from './dto/ficha-planta.dto.js';

const TIPOS_CULTIVO = ['hortaliza', 'frutal', 'cereal', 'ornamental', 'otro'];

@ApiTags('plantas')
@Controller('plantas')
export class PlantasController {
    constructor(private readonly plantasService: PlantasService) { }

    @Post()
    @ApiOperation({ summary: 'Crear una planta' })
    @ApiBody({ type: CrearPlantaDto })
    @ApiResponse({ status: 201, description: 'Planta creada' })
    @ApiResponse({ status: 400, description: 'Campo faltante, vacío, de tipo incorrecto, valor no permitido o secuencia inválida' })
    @ApiResponse({ status: 409, description: 'Ya existe una planta con ese nombre científico' })
    crearPlanta(@Body() dto: CrearPlantaDto) {
        const datos = dto ?? ({} as CrearPlantaDto);
        lanzarSiHayErrores([
            validarTexto(datos.nombreComun, 'nombreComun', 100),
            validarTexto(datos.nombreCientifico, 'nombreCientifico', 150),
            validarTexto(datos.familiaBotanica, 'familiaBotanica', 100),
            validarLista(datos.tipoCultivo, 'tipoCultivo', TIPOS_CULTIVO),
            validarSecuencia(datos.secuenciaGenetica, 'secuenciaGenetica'),
        ]);
        return this.plantasService.crear(datos);
    }

    @Get()
    @ApiOperation({ summary: 'Listar plantas, con filtros opcionales' })
    @ApiQuery({ name: 'tipoCultivo', required: false, description: 'Valores permitidos: hortaliza, frutal, cereal, ornamental, otro' })
    @ApiQuery({ name: 'familiaBotanica', required: false, description: 'Familia botánica exacta' })
    @ApiQuery({ name: 'nombre', required: false, description: 'Busca dentro del nombre común' })
    @ApiResponse({ status: 200, description: 'Lista de plantas' })
    @ApiResponse({ status: 400, description: 'Un filtro es inválido' })
    obtenerPlantas(
        @Query('tipoCultivo') tipoCultivo?: string,
        @Query('familiaBotanica') familiaBotanica?: string,
        @Query('nombre') nombre?: string,
    ) {
        const errores: ErrorValidacion[] = [];
        if (tipoCultivo !== undefined) {
            errores.push(validarLista(tipoCultivo, 'tipoCultivo', TIPOS_CULTIVO));
        }
        if (familiaBotanica !== undefined) {
            errores.push(validarTexto(familiaBotanica, 'familiaBotanica'));
        }
        if (nombre !== undefined) {
            errores.push(validarTexto(nombre, 'nombre'));
        }
        lanzarSiHayErrores(errores);
        return this.plantasService.listar(tipoCultivo, familiaBotanica, nombre);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar una planta por id' })
    @ApiParam({ name: 'id', description: 'Id de la planta' })
    @ApiResponse({ status: 200, description: 'Planta encontrada' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la planta' })
    obtenerPlanta(@Param('id') id: string) {
        return this.plantasService.obtener(parsearIdRuta(id));
    }

    @Get(':id/ficha')
    @ApiOperation({ summary: 'Ficha de una planta: sus cultivos y las enfermedades que la afectan con su nivel de susceptibilidad' })
    @ApiParam({ name: 'id', description: 'Id de la planta' })
    @ApiResponse({ status: 200, description: 'Ficha de la planta', type: FichaPlantaDto })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la planta' })
    obtenerFicha(@Param('id') id: string) {
        return this.plantasService.obtenerFicha(parsearIdRuta(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar parcialmente una planta' })
    @ApiParam({ name: 'id', description: 'Id de la planta' })
    @ApiBody({ type: ActualizarPlantaDto })
    @ApiResponse({ status: 200, description: 'Planta actualizada' })
    @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
    @ApiResponse({ status: 404, description: 'No existe la planta' })
    @ApiResponse({ status: 409, description: 'Ya existe una planta con ese nombre científico' })
    actualizarPlanta(@Param('id') id: string, @Body() dto: ActualizarPlantaDto) {
        const idNumero = parsearIdRuta(id);
        validarBodyNoVacio(dto);

        const errores: ErrorValidacion[] = [];
        if (dto.nombreComun !== undefined) {
            errores.push(validarTexto(dto.nombreComun, 'nombreComun', 100));
        }
        if (dto.nombreCientifico !== undefined) {
            errores.push(validarTexto(dto.nombreCientifico, 'nombreCientifico', 150));
        }
        if (dto.familiaBotanica !== undefined) {
            errores.push(validarTexto(dto.familiaBotanica, 'familiaBotanica', 100));
        }
        if (dto.tipoCultivo !== undefined) {
            errores.push(validarLista(dto.tipoCultivo, 'tipoCultivo', TIPOS_CULTIVO));
        }
        if (dto.secuenciaGenetica !== undefined) {
            errores.push(validarSecuencia(dto.secuenciaGenetica, 'secuenciaGenetica'));
        }
        lanzarSiHayErrores(errores);

        return this.plantasService.actualizar(idNumero, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una planta' })
    @ApiParam({ name: 'id', description: 'Id de la planta' })
    @ApiResponse({ status: 200, description: 'Planta eliminada, con mensaje de confirmación' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe la planta' })
    eliminarPlanta(@Param('id') id: string) {
        return this.plantasService.eliminar(parsearIdRuta(id));
    }
}
