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
import { CrearPatogenoDto } from './dto/crear-patogeno.dto.js';
import { ActualizarPatogenoDto } from './dto/actualizar-patogeno.dto.js';
import { PatogenosService } from './patogenos.service.js';

const TIPOS_PATOGENO = ['virus', 'hongo', 'oomiceto', 'bacteria', 'insecto', 'nematodo'];
const FORMAS_TRANSMISION = ['viento', 'agua', 'suelo', 'contacto', 'insectos_vectores', 'otro'];

@ApiTags('patogenos')
@Controller('patogenos')
export class PatogenosController {
    constructor(private readonly patogenosService: PatogenosService) {}

    @Post('')
    @ApiOperation({ summary: 'Crear un patógeno' })
    @ApiBody({ type: CrearPatogenoDto })
    @ApiResponse({ status: 201, description: 'Patógeno creado' })
    @ApiResponse({ status: 400, description: 'Campo faltante, vacío, de tipo incorrecto, valor no permitido o secuencia inválida' })
    @ApiResponse({ status: 409, description: 'Ya existe un patógeno con ese nombre científico' })
    crearPatogeno(@Body() dto: CrearPatogenoDto) {
        const datos = dto ?? ({} as CrearPatogenoDto);
        lanzarSiHayErrores([
            validarTexto(datos.nombre, 'nombre', 100),
            validarTexto(datos.nombreCientifico, 'nombreCientifico', 150),
            validarLista(datos.tipo, 'tipo', TIPOS_PATOGENO),
            validarLista(datos.formaTransmision, 'formaTransmision', FORMAS_TRANSMISION),
            validarSecuencia(datos.secuenciaGenetica, 'secuenciaGenetica'),
        ]);
        return this.patogenosService.crear(datos);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar un patógeno por id' })
    @ApiParam({ name: 'id', description: 'Id del patógeno' })
    @ApiResponse({ status: 200, description: 'Patógeno encontrado' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el patógeno' })
    obtenerPatogeno(@Param('id') id: string) {
        return this.patogenosService.obtener(parsearIdRuta(id));
    }

    @Get('')
    @ApiOperation({ summary: 'Listar patógenos, con filtros opcionales' })
    @ApiQuery({ name: 'tipo', required: false, description: 'Valores permitidos: virus, hongo, oomiceto, bacteria, insecto, nematodo' })
    @ApiQuery({ name: 'formaTransmision', required: false, description: 'Valores permitidos: viento, agua, suelo, contacto, insectos_vectores, otro' })
    @ApiResponse({ status: 200, description: 'Lista de patógenos' })
    @ApiResponse({ status: 400, description: 'Un filtro tiene un valor no permitido' })
    obtenerPatogenos(@Query('tipo') tipo?: string, @Query('formaTransmision') formaTransmision?: string) {
        const errores: ErrorValidacion[] = [];
        if (tipo !== undefined) {
            errores.push(validarLista(tipo, 'tipo', TIPOS_PATOGENO));
        }
        if (formaTransmision !== undefined) {
            errores.push(validarLista(formaTransmision, 'formaTransmision', FORMAS_TRANSMISION));
        }
        lanzarSiHayErrores(errores);
        return this.patogenosService.listar(tipo, formaTransmision);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un patógeno' })
    @ApiParam({ name: 'id', description: 'Id del patógeno' })
    @ApiResponse({ status: 200, description: 'Patógeno eliminado, con mensaje de confirmación' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el patógeno' })
    @ApiResponse({ status: 409, description: 'El patógeno tiene enfermedades asociadas' })
    eliminarPatogeno(@Param('id') id: string) {
        return this.patogenosService.eliminar(parsearIdRuta(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar parcialmente un patógeno' })
    @ApiParam({ name: 'id', description: 'Id del patógeno' })
    @ApiBody({ type: ActualizarPatogenoDto })
    @ApiResponse({ status: 200, description: 'Patógeno actualizado' })
    @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
    @ApiResponse({ status: 404, description: 'No existe el patógeno' })
    @ApiResponse({ status: 409, description: 'Ya existe un patógeno con ese nombre científico' })
    actualizarPatogeno(@Param('id') id: string, @Body() dto: ActualizarPatogenoDto) {
        const idNumero = parsearIdRuta(id);
        validarBodyNoVacio(dto);

        const errores: ErrorValidacion[] = [];
        if (dto.nombre !== undefined) {
            errores.push(validarTexto(dto.nombre, 'nombre', 100));
        }
        if (dto.nombreCientifico !== undefined) {
            errores.push(validarTexto(dto.nombreCientifico, 'nombreCientifico', 150));
        }
        if (dto.tipo !== undefined) {
            errores.push(validarLista(dto.tipo, 'tipo', TIPOS_PATOGENO));
        }
        if (dto.formaTransmision !== undefined) {
            errores.push(validarLista(dto.formaTransmision, 'formaTransmision', FORMAS_TRANSMISION));
        }
        if (dto.secuenciaGenetica !== undefined) {
            errores.push(validarSecuencia(dto.secuenciaGenetica, 'secuenciaGenetica'));
        }
        lanzarSiHayErrores(errores);

        return this.patogenosService.actualizar(idNumero, dto);
    }
}
