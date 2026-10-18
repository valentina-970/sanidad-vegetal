import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { ActualizarBroteDto } from './dto/actualizar-brote.dto.js';
import { CrearBroteDto } from './dto/crear-brote.dto.js';
import { Brote } from './entities/brote.entity.js';

@Injectable()
export class BrotesService {
  constructor(
    @InjectRepository(Brote)
    private readonly brotesRepository: Repository<Brote>,
    @InjectRepository(Planta)
    private readonly plantasRepository: Repository<Planta>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,
  ) {}

  async crear(datos: CrearBroteDto): Promise<Brote> {
    await this.verificarReferencias(datos.plantaId, datos.enfermedadId);

    const brote = this.brotesRepository.create({
      plantaId: datos.plantaId,
      enfermedadId: datos.enfermedadId,
      region: datos.region,
      fecha: datos.fecha,
      hectareas: datos.hectareas,
    });
    return this.brotesRepository.save(brote);
  }

  async listar(
    plantaId?: number,
    enfermedadId?: number,
    region?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<Brote[]> {
    const filtros: FindOptionsWhere<Brote> = {};

    if (plantaId !== undefined) {
      filtros.plantaId = plantaId;
    }
    if (enfermedadId !== undefined) {
      filtros.enfermedadId = enfermedadId;
    }
    if (region !== undefined) {
      filtros.region = region;
    }

    if (fechaInicio !== undefined && fechaFin !== undefined) {
      filtros.fecha = Between(fechaInicio, fechaFin);
    } else if (fechaInicio !== undefined) {
      filtros.fecha = MoreThanOrEqual(fechaInicio);
    } else if (fechaFin !== undefined) {
      filtros.fecha = LessThanOrEqual(fechaFin);
    }

    return this.brotesRepository.find({ where: filtros });
  }

  async obtener(id: number): Promise<Brote> {
    const brote = await this.brotesRepository.findOneBy({ id });
    if (!brote) {
      throw new NotFoundException(`No existe el brote con id ${id}`);
    }
    return brote;
  }

  async actualizar(id: number, datos: ActualizarBroteDto): Promise<Brote> {
    const brote = await this.obtener(id);

    if (datos.plantaId !== undefined || datos.enfermedadId !== undefined) {
      await this.verificarReferencias(datos.plantaId, datos.enfermedadId);
      if (datos.plantaId !== undefined) brote.plantaId = datos.plantaId;
      if (datos.enfermedadId !== undefined) brote.enfermedadId = datos.enfermedadId;
    }

    if (datos.region !== undefined) brote.region = datos.region;
    if (datos.fecha !== undefined) brote.fecha = datos.fecha;
    if (datos.hectareas !== undefined) brote.hectareas = datos.hectareas;

    return this.brotesRepository.save(brote);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    const brote = await this.obtener(id);
    await this.brotesRepository.remove(brote);
    return { mensaje: `Brote ${id} eliminado correctamente` };
  }

  private async verificarReferencias(plantaId?: number, enfermedadId?: number): Promise<void> {
    const errores: string[] = [];
    if (plantaId !== undefined && !(await this.plantasRepository.existsBy({ id: plantaId }))) {
      errores.push(`No existe la planta con id ${plantaId}`);
    }
    if (enfermedadId !== undefined && !(await this.enfermedadesRepository.existsBy({ id: enfermedadId }))) {
      errores.push(`No existe la enfermedad con id ${enfermedadId}`);
    }
    if (errores.length > 0) {
      throw new NotFoundException(errores.join('. '));
    }
  }
}