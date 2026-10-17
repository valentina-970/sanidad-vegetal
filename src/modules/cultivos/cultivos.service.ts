import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { ActualizarCultivoDto } from './dto/actualizar-cultivo.dto.js';
import { CrearCultivoDto } from './dto/crear-cultivo.dto.js';
import { Cultivo } from './entities/cultivos.entity.js';

@Injectable()
export class CultivosService {
    constructor(
        @InjectRepository(Cultivo)
        private readonly cultivosRepository: Repository<Cultivo>,
        @InjectRepository(Planta)
        private readonly plantasRepository: Repository<Planta>,
    ) { }

    async crear(datos: CrearCultivoDto): Promise<Cultivo> {
        await this.verificarPlantaExiste(datos.plantaId);

        const cultivo = this.cultivosRepository.create({
            plantaId: datos.plantaId,
            loteFinca: datos.loteFinca.trim(),
            region: datos.region.trim(),
            fechaSiembra: datos.fechaSiembra,
            codigoGeneticoSemilla: datos.codigoGeneticoSemilla,
        });
        return this.cultivosRepository.save(cultivo);
    }

    async listar(plantaId?: number, region?: string, desde?: string, hasta?: string): Promise<Cultivo[]> {
        const filtros: FindOptionsWhere<Cultivo> = {};
        if (plantaId !== undefined) {
            filtros.plantaId = plantaId;
        }
        if (region !== undefined) {
            filtros.region = region.trim();
        }
        if (desde !== undefined && hasta !== undefined) {
            filtros.fechaSiembra = Between(desde, hasta);
        } else if (desde !== undefined) {
            filtros.fechaSiembra = MoreThanOrEqual(desde);
        } else if (hasta !== undefined) {
            filtros.fechaSiembra = LessThanOrEqual(hasta);
        }
        return this.cultivosRepository.find({ where: filtros });
    }

    async obtener(id: number): Promise<Cultivo> {
        const cultivo = await this.cultivosRepository.findOneBy({ id });
        if (!cultivo) {
            throw new NotFoundException(`No existe el cultivo con id ${id}`);
        }
        return cultivo;
    }

    async actualizar(id: number, datos: ActualizarCultivoDto): Promise<Cultivo> {
        const cultivo = await this.obtener(id);

        if (datos.plantaId !== undefined) {
            await this.verificarPlantaExiste(datos.plantaId);
            cultivo.plantaId = datos.plantaId;
        }
        if (datos.loteFinca !== undefined) {
            cultivo.loteFinca = datos.loteFinca.trim();
        }
        if (datos.region !== undefined) {
            cultivo.region = datos.region.trim();
        }
        if (datos.fechaSiembra !== undefined) {
            cultivo.fechaSiembra = datos.fechaSiembra;
        }
        if (datos.codigoGeneticoSemilla !== undefined) {
            cultivo.codigoGeneticoSemilla = datos.codigoGeneticoSemilla;
        }

        return this.cultivosRepository.save(cultivo);
    }

    async eliminar(id: number): Promise<{ mensaje: string }> {
        const cultivo = await this.obtener(id);
        await this.cultivosRepository.remove(cultivo);
        return { mensaje: `Cultivo ${id} eliminado correctamente` };
    }

    private async verificarPlantaExiste(plantaId: number): Promise<void> {
        const planta = await this.plantasRepository.findOneBy({ id: plantaId });
        if (!planta) {
            throw new NotFoundException(`No existe la planta con id ${plantaId}`);
        }
    }
}
