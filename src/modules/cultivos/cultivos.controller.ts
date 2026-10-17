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
    validarSecuencia,
    validarTexto,
} from '../../common/validaciones.js';
import { ActualizarCultivoDto } from './dto/actualizar-cultivo.dto.js';
import { CrearCultivoDto } from './dto/crear-cultivo.dto.js';
import { CultivosService } from './cultivos.service.js';

@ApiTags('cultivos')
@Controller('cultivos')
export class CultivosController {
    constructor(private readonly cultivosService: CultivosService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un cultivo' })
    @ApiBody({ type: CrearCultivoDto })
    @ApiResponse({ status: 201, description: 'Cultivo creado' })
    @ApiResponse({ status: 400, description: 'Campo faltante, vacío, de tipo incorrecto, fecha inválida o futura, o código genético inválido' })
    @ApiResponse({ status: 404, description: 'No existe la planta indicada' })
    crearCultivo(@Body() dto: CrearCultivoDto) {
        const datos = dto ?? ({} as CrearCultivoDto);
        lanzarSiHayErrores([
            validarId(datos.plantaId, 'plantaId'),
            validarTexto(datos.loteFinca, 'loteFinca', 100),
            validarTexto(datos.region, 'region', 100),
            validarFecha(datos.fechaSiembra, 'fechaSiembra'),
            validarSecuencia(datos.codigoGeneticoSemilla, 'codigoGeneticoSemilla'),
        ]);
        return this.cultivosService.crear(datos);
    }

    @Get()
    @ApiOperation({ summary: 'Listar cultivos, con filtros opcionales' })
    @ApiQuery({ name: 'plantaId', required: false, description: 'Id de la planta' })
    @ApiQuery({ name: 'region', required: false, description: 'Región exacta' })
    @ApiQuery({ name: 'desde', required: false, description: 'Fecha de siembra mínima (YYYY-MM-DD)' })
    @ApiQuery({ name: 'hasta', required: false, description: 'Fecha de siembra máxima (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: 'Lista de cultivos' })
    @ApiResponse({ status: 400, description: 'Un filtro es inválido o desde es posterior a hasta' })
    obtenerCultivos(
        @Query('plantaId') plantaId?: string,
        @Query('region') region?: string,
        @Query('desde') desde?: string,
        @Query('hasta') hasta?: string,
    ) {
        const errores: ErrorValidacion[] = [];
        if (plantaId !== undefined) {
            errores.push(validarIdTexto(plantaId, 'plantaId'));
        }
        if (region !== undefined) {
            errores.push(validarTexto(region, 'region'));
        }
        const errorDesde = desde === undefined ? null : validarFormatoFecha(desde, 'desde');
        const errorHasta = hasta === undefined ? null : validarFormatoFecha(hasta, 'hasta');
        errores.push(errorDesde, errorHasta);
        if (desde !== undefined && hasta !== undefined && !errorDesde && !errorHasta && desde > hasta) {
            errores.push(`El filtro desde (${desde}) no puede ser posterior a hasta (${hasta})`);
        }
        lanzarSiHayErrores(errores);
        return this.cultivosService.listar(
            plantaId !== undefined ? Number(plantaId) : undefined,
            region,
            desde,
            hasta,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar un cultivo por id' })
    @ApiParam({ name: 'id', description: 'Id del cultivo' })
    @ApiResponse({ status: 200, description: 'Cultivo encontrado' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el cultivo' })
    obtenerCultivo(@Param('id') id: string) {
        return this.cultivosService.obtener(parsearIdRuta(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar parcialmente un cultivo' })
    @ApiParam({ name: 'id', description: 'Id del cultivo' })
    @ApiBody({ type: ActualizarCultivoDto })
    @ApiResponse({ status: 200, description: 'Cultivo actualizado' })
    @ApiResponse({ status: 400, description: 'Id inválido, body vacío o algún campo inválido' })
    @ApiResponse({ status: 404, description: 'No existe el cultivo o la planta indicada' })
    actualizarCultivo(@Param('id') id: string, @Body() dto: ActualizarCultivoDto) {
        const idNumero = parsearIdRuta(id);
        validarBodyNoVacio(dto);

        const errores: ErrorValidacion[] = [];
        if (dto.plantaId !== undefined) {
            errores.push(validarId(dto.plantaId, 'plantaId'));
        }
        if (dto.loteFinca !== undefined) {
            errores.push(validarTexto(dto.loteFinca, 'loteFinca', 100));
        }
        if (dto.region !== undefined) {
            errores.push(validarTexto(dto.region, 'region', 100));
        }
        if (dto.fechaSiembra !== undefined) {
            errores.push(validarFecha(dto.fechaSiembra, 'fechaSiembra'));
        }
        if (dto.codigoGeneticoSemilla !== undefined) {
            errores.push(validarSecuencia(dto.codigoGeneticoSemilla, 'codigoGeneticoSemilla'));
        }
        lanzarSiHayErrores(errores);

        return this.cultivosService.actualizar(idNumero, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un cultivo' })
    @ApiParam({ name: 'id', description: 'Id del cultivo' })
    @ApiResponse({ status: 200, description: 'Cultivo eliminado, con mensaje de confirmación' })
    @ApiResponse({ status: 400, description: 'El id no es un entero positivo' })
    @ApiResponse({ status: 404, description: 'No existe el cultivo' })
    eliminarCultivo(@Param('id') id: string) {
        return this.cultivosService.eliminar(parsearIdRuta(id));
    }
}
