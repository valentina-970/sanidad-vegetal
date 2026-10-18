import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { ActualizarBroteDto } from './dto/actualizar-brote.dto.js';
import { CrearBroteDto } from './dto/crear-brote.dto.js';
import { EstadisticasBrotesDto, ItemEstadisticaDto } from './dto/estadisticas-brotes.dto.js';
import { Brote } from './entities/brote.entity.js';

@Injectable()
export class BrotesService {
  constructor(
    @InjectRepository(Brote)
    private readonly broteRepository: Repository<Brote>,
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadRepository: Repository<Enfermedad>,
  ) {}

  private async verificarReferencias(plantaId?: number, enfermedadId?: number) {
    if (plantaId !== undefined) {
      const existePlanta = await this.plantaRepository.existsBy({ id: plantaId });
      if (!existePlanta) {
        throw new NotFoundException(`No existe la planta con el id ${plantaId}`);
      }
    }
    if (enfermedadId !== undefined) {
      const existeEnfermedad = await this.enfermedadRepository.existsBy({ id: enfermedadId });
      if (!existeEnfermedad) {
        throw new NotFoundException(`No existe la enfermedad con el id ${enfermedadId}`);
      }
    }
  }

  async crear(dto: CrearBroteDto) {
    await this.verificarReferencias(dto.plantaId, dto.enfermedadId);
    const brote = this.broteRepository.create(dto);
    return this.broteRepository.save(brote);
  }

  async listar(
    plantaId?: number,
    enfermedadId?: number,
    region?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const query = this.broteRepository.createQueryBuilder('brote');

    if (plantaId !== undefined) {
      query.andWhere('brote.plantaId = :plantaId', { plantaId });
    }
    if (enfermedadId !== undefined) {
      query.andWhere('brote.enfermedadId = :enfermedadId', { enfermedadId });
    }
    if (region !== undefined) {
      query.andWhere('LOWER(brote.region) LIKE LOWER(:region)', { region: `%${region}%` });
    }
    if (fechaInicio !== undefined) {
      query.andWhere('brote.fecha >= :fechaInicio', { fechaInicio });
    }
    if (fechaFin !== undefined) {
      query.andWhere('brote.fecha <= :fechaFin', { fechaFin });
    }

    return query.orderBy('brote.fecha', 'DESC').getMany();
  }

  async obtener(id: number) {
    const brote = await this.broteRepository.findOne({ where: { id } });
    if (!brote) {
      throw new NotFoundException(`No existe el brote con el id ${id}`);
    }
    return brote;
  }

  async actualizar(id: number, dto: ActualizarBroteDto) {
    await this.obtener(id);
    await this.verificarReferencias(dto.plantaId, dto.enfermedadId);
    await this.broteRepository.update(id, dto);
    return this.obtener(id);
  }

  async eliminar(id: number) {
    await this.obtener(id);
    await this.broteRepository.delete(id);
    return { mensaje: `Brote con id ${id} eliminado exitosamente` };
  }

  async obtenerEstadisticas(): Promise<EstadisticasBrotesDto> {
    const [brotes, plantas, enfermedades] = await Promise.all([
      this.broteRepository.find(),
      this.plantaRepository.find(),
      this.enfermedadRepository.find(),
    ]);

    const mapaPlantas = new Map(plantas.map((p) => [p.id, p]));
    const mapaEnfermedades = new Map(enfermedades.map((e) => [e.id, e]));

    const agrupar = (getClave: (b: Brote) => string): ItemEstadisticaDto[] => {
      const mapa = new Map<string, { totalBrotes: number; totalHectareas: number }>();

      for (const brote of brotes) {
        const clave = getClave(brote) || 'Sin especificar';
        const hectareas = Number(brote.hectareas) || 0;

        if (!mapa.has(clave)) {
          mapa.set(clave, { totalBrotes: 0, totalHectareas: 0 });
        }

        const acumulado = mapa.get(clave)!;
        acumulado.totalBrotes += 1;
        acumulado.totalHectareas = Number((acumulado.totalHectareas + hectareas).toFixed(2));
      }

      return Array.from(mapa.entries()).map(([grupo, datos]) => ({
        grupo,
        totalBrotes: datos.totalBrotes,
        totalHectareas: datos.totalHectareas,
      }));
    };

    return {
      porEnfermedad: agrupar(
        (b) => mapaEnfermedades.get(b.enfermedadId)?.nombre || `Enfermedad #${b.enfermedadId}`,
      ),
      porPatogeno: agrupar((b) => {
        const enf = mapaEnfermedades.get(b.enfermedadId) as Record<string, any> | undefined;
        return enf?.patogeno || enf?.tipoAgente || 'No especificado';
      }),
      porRegion: agrupar((b) => b.region),
      porCultivo: agrupar((b) => {
        const p = mapaPlantas.get(b.plantaId) as Record<string, any> | undefined;
        return p?.nombre || p?.nombreComun || `Planta #${b.plantaId}`;
      }),
      porMes: agrupar((b) => (b.fecha ? String(b.fecha).substring(0, 7) : 'Sin fecha')),
    };
  }
}