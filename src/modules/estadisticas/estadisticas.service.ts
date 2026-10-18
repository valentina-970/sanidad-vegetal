import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Brote } from '../brotes/entities/brote.entity.js';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { EstadisticaBrotesDto } from './dto/estadistica-brotes.dto.js';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Brote)
    private readonly brotesRepository: Repository<Brote>,
    @InjectRepository(Planta)
    private readonly plantasRepository: Repository<Planta>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,
    @InjectRepository(Patogeno)
    private readonly patogenosRepository: Repository<Patogeno>,
  ) {}

  async porEnfermedad(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]> {
    const brotes = await this.buscarBrotes(desde, hasta);
    const enfermedades = await this.enfermedadesRepository.find();
    const nombres = new Map(enfermedades.map((e) => [e.id, e.nombre]));
    return this.ordenarPorHectareas(
      this.agrupar(brotes, (b) => nombres.get(b.enfermedadId) ?? `Enfermedad ${b.enfermedadId}`),
    );
  }

  async porPatogeno(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]> {
    const brotes = await this.buscarBrotes(desde, hasta);
    const enfermedades = await this.enfermedadesRepository.find();
    const patogenos = await this.patogenosRepository.find();
    const patogenoDeEnfermedad = new Map(enfermedades.map((e) => [e.id, e.patogenoId]));
    const nombres = new Map(patogenos.map((p) => [p.id, p.nombre]));
    return this.ordenarPorHectareas(
      this.agrupar(brotes, (b) => {
        const patogenoId = patogenoDeEnfermedad.get(b.enfermedadId);
        return patogenoId !== undefined ? (nombres.get(patogenoId) ?? `Patógeno ${patogenoId}`) : 'Sin patógeno';
      }),
    );
  }

  async porRegion(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]> {
    const brotes = await this.buscarBrotes(desde, hasta);
    return this.ordenarPorHectareas(this.agrupar(brotes, (b) => b.region));
  }

  async porTipoCultivo(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]> {
    const brotes = await this.buscarBrotes(desde, hasta);
    const plantas = await this.plantasRepository.find();
    const tipos = new Map(plantas.map((p) => [p.id, p.tipoCultivo]));
    return this.ordenarPorHectareas(
      this.agrupar(brotes, (b) => tipos.get(b.plantaId) ?? 'Sin planta'),
    );
  }

  async porMes(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]> {
    const brotes = await this.buscarBrotes(desde, hasta);
    return this.agrupar(brotes, (b) => b.fecha.substring(0, 7)).sort((a, b) =>
      a.grupo.localeCompare(b.grupo),
    );
  }

  private buscarBrotes(desde?: string, hasta?: string): Promise<Brote[]> {
    const filtros: FindOptionsWhere<Brote> = {};
    if (desde !== undefined && hasta !== undefined) {
      filtros.fecha = Between(desde, hasta);
    } else if (desde !== undefined) {
      filtros.fecha = MoreThanOrEqual(desde);
    } else if (hasta !== undefined) {
      filtros.fecha = LessThanOrEqual(hasta);
    }
    return this.brotesRepository.find({ where: filtros });
  }

  private agrupar(brotes: Brote[], obtenerGrupo: (brote: Brote) => string): EstadisticaBrotesDto[] {
    const grupos = new Map<string, EstadisticaBrotesDto>();
    for (const brote of brotes) {
      const grupo = obtenerGrupo(brote);
      const actual = grupos.get(grupo) ?? { grupo, totalBrotes: 0, totalHectareas: 0 };
      actual.totalBrotes += 1;
      actual.totalHectareas += brote.hectareasAfectadas;
      grupos.set(grupo, actual);
    }
    return [...grupos.values()].map((g) => ({
      ...g,
      totalHectareas: Math.round(g.totalHectareas * 100) / 100,
    }));
  }

  private ordenarPorHectareas(lista: EstadisticaBrotesDto[]): EstadisticaBrotesDto[] {
    return lista.sort((a, b) => b.totalHectareas - a.totalHectareas);
  }
}