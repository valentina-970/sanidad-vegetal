import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ActualizarPlantaDto } from './dto/actualizar-planta.dto.js';
import { CrearPlantaDto } from './dto/crear-planta.dto.js';
import { Planta } from './entities/plantas.entity.js';

@Injectable()
export class PlantasService {
    constructor(
        @InjectRepository(Planta)
        private readonly plantasRepository: Repository<Planta>,
    ) { }

    async crear(datos: CrearPlantaDto): Promise<Planta> {
        const nombreCientifico = datos.nombreCientifico.trim();
        await this.verificarNombreCientificoLibre(nombreCientifico);

        const planta = this.plantasRepository.create({
            nombreComun: datos.nombreComun.trim(),
            nombreCientifico,
            familiaBotanica: datos.familiaBotanica.trim(),
            tipoCultivo: datos.tipoCultivo,
            secuenciaGenetica: datos.secuenciaGenetica,
        });
        return this.plantasRepository.save(planta);
    }

    async listar(tipoCultivo?: string, familiaBotanica?: string, nombre?: string): Promise<Planta[]> {
        const filtros: FindOptionsWhere<Planta> = {};
        if (tipoCultivo !== undefined) {
            filtros.tipoCultivo = tipoCultivo;
        }
        if (familiaBotanica !== undefined) {
            filtros.familiaBotanica = familiaBotanica.trim();
        }
        if (nombre !== undefined) {
            filtros.nombreComun = Like(`%${nombre.trim()}%`);
        }
        return this.plantasRepository.find({ where: filtros });
    }

    async obtener(id: number): Promise<Planta> {
        const planta = await this.plantasRepository.findOneBy({ id });
        if (!planta) {
            throw new NotFoundException(`No existe la planta con id ${id}`);
        }
        return planta;
    }

    async actualizar(id: number, datos: ActualizarPlantaDto): Promise<Planta> {
        const planta = await this.obtener(id);

        if (datos.nombreCientifico !== undefined) {
            const nuevoNombreCientifico = datos.nombreCientifico.trim();
            if (nuevoNombreCientifico !== planta.nombreCientifico) {
                await this.verificarNombreCientificoLibre(nuevoNombreCientifico);
            }
            planta.nombreCientifico = nuevoNombreCientifico;
        }
        if (datos.nombreComun !== undefined) {
            planta.nombreComun = datos.nombreComun.trim();
        }
        if (datos.familiaBotanica !== undefined) {
            planta.familiaBotanica = datos.familiaBotanica.trim();
        }
        if (datos.tipoCultivo !== undefined) {
            planta.tipoCultivo = datos.tipoCultivo;
        }
        if (datos.secuenciaGenetica !== undefined) {
            planta.secuenciaGenetica = datos.secuenciaGenetica;
        }

        return this.plantasRepository.save(planta);
    }

    async eliminar(id: number): Promise<{ mensaje: string }> {
        const planta = await this.obtener(id);
        await this.plantasRepository.remove(planta);
        return { mensaje: `Planta ${id} eliminada correctamente` };
    }

    private async verificarNombreCientificoLibre(nombreCientifico: string): Promise<void> {
        const existente = await this.plantasRepository.findOneBy({ nombreCientifico });
        if (existente) {
            throw new ConflictException(`Ya existe una planta con el nombre científico ${nombreCientifico}`);
        }
    }
}
