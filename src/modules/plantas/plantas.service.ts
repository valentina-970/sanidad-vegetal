import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ActualizarPlantaDto } from './dto/actualizar-planta.dto.js';
import { CrearPlantaDto } from './dto/crear-planta.dto.js';
import { Planta } from './entities/plantas.entity.js';
import { Cultivo } from '../cultivos/entities/cultivos.entity.js';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Susceptibilidad } from '../susceptibilidades/entities/susceptibilidades.entity.js';
import { EnfermedadConNivelDto, FichaPlantaDto } from './dto/ficha-planta.dto.js';
import { Brote } from '../brotes/entities/brote.entity.js';
import { contar, unirConY } from '../../common/mensajes.js';

const ORDEN_NIVEL: Record<string, number> = { alta: 0, media: 1, baja: 2 };

@Injectable()
export class PlantasService {
    constructor(
        @InjectRepository(Planta)
        private readonly plantasRepository: Repository<Planta>,
        @InjectRepository(Cultivo)
        private readonly cultivosRepository: Repository<Cultivo>,
        @InjectRepository(Susceptibilidad)
        private readonly susceptibilidadesRepository: Repository<Susceptibilidad>,
        @InjectRepository(Enfermedad)
        private readonly enfermedadesRepository: Repository<Enfermedad>,
        @InjectRepository(Brote)
        private readonly brotesRepository: Repository<Brote>
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

        const [cultivos, susceptibilidades, brotes] = await Promise.all([
            this.cultivosRepository.countBy({ plantaId: id }),
            this.susceptibilidadesRepository.countBy({ plantaId: id }),
            this.brotesRepository.countBy({ plantaId: id }),
        ]);

        const dependientes: string[] = [];
        if (cultivos > 0) {
            dependientes.push(contar(cultivos, 'cultivo', 'cultivos'));
        }
        if (susceptibilidades > 0) {
            dependientes.push(contar(susceptibilidades, 'susceptibilidad', 'susceptibilidades'));
        }
        if (brotes > 0) {
            dependientes.push(contar(brotes, 'brote', 'brotes'));
        }
        if (dependientes.length > 0) {
            throw new ConflictException(
                `No se puede eliminar la planta ${id} porque tiene registros asociados: ${unirConY(dependientes)}`,
            );
        }

        await this.plantasRepository.remove(planta);
        return { mensaje: `Planta ${id} eliminada correctamente` };
    }

    async obtenerFicha(id: number): Promise<FichaPlantaDto> {
        const planta = await this.obtener(id);

        const cultivos = await this.cultivosRepository.find({
            where: { plantaId: id },
            order: { fechaSiembra: 'DESC' },
        });
        const susceptibilidades = await this.susceptibilidadesRepository.findBy({ plantaId: id });

        const idsEnfermedades = susceptibilidades.map((s) => s.enfermedadId);
        const enfermedadesEncontradas =
            idsEnfermedades.length > 0
                ? await this.enfermedadesRepository.findBy({ id: In(idsEnfermedades) })
                : [];
        const enfermedadesPorId = new Map(enfermedadesEncontradas.map((e) => [e.id, e]));

        const enfermedades: EnfermedadConNivelDto[] = susceptibilidades.flatMap((s) => {
            const enfermedad = enfermedadesPorId.get(s.enfermedadId);
            if (!enfermedad) {
                return [];
            }
            return [{
                enfermedadId: enfermedad.id,
                nombre: enfermedad.nombre,
                sintomas: enfermedad.sintomas,
                epocaRiesgo: enfermedad.epocaRiesgo,
                patogenoId: enfermedad.patogenoId,
                nivel: s.nivel,
            }];
        });
        enfermedades.sort((a, b) => ORDEN_NIVEL[a.nivel] - ORDEN_NIVEL[b.nivel]);

        return { planta, cultivos, enfermedades };
    }

    private async verificarNombreCientificoLibre(nombreCientifico: string): Promise<void> {
        const existente = await this.plantasRepository.findOneBy({ nombreCientifico });
        if (existente) {
            throw new ConflictException(`Ya existe una planta con el nombre científico ${nombreCientifico}`);
        }
    }
}
