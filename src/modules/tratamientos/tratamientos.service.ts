import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { ActualizarTratamientoDto } from './dto/actualizar-tratamientos.dto.js';
import { CrearTratamientoDto } from './dto/crear-tratamientos.dto.js';
import { Tratamiento } from './entities/tratamientos.entity.js';
import type { TratamientosServiceInterface } from './tratamientos-service-interface.js';

@Injectable()
export class TratamientosService implements TratamientosServiceInterface {
  constructor(
    @InjectRepository(Tratamiento)
    private readonly tratamientosRepository: Repository<Tratamiento>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,
  ) {}

  async crear(datos: CrearTratamientoDto): Promise<Tratamiento> {
    await this.verificarEnfermedadExiste(datos.enfermedadId);

    const tratamiento = this.tratamientosRepository.create({
      nombre: datos.nombre.trim(),
      descripcionAplicacion: datos.descripcionAplicacion.trim(),
      tipo: datos.tipo,
      enfermedadId: datos.enfermedadId,
    });
    return this.tratamientosRepository.save(tratamiento);
  }

  async listar(tipo?: string, enfermedadId?: number): Promise<Tratamiento[]> {
    const filtros: { tipo?: string; enfermedadId?: number } = {};
    if (tipo !== undefined) {
      filtros.tipo = tipo;
    }
    if (enfermedadId !== undefined) {
      filtros.enfermedadId = enfermedadId;
    }
    return this.tratamientosRepository.find({ where: filtros });
  }

  async obtener(id: number): Promise<Tratamiento> {
    const tratamiento = await this.tratamientosRepository.findOneBy({ id });
    if (!tratamiento) {
      throw new NotFoundException(`No existe el tratamiento con id ${id}`);
    }
    return tratamiento;
  }

  async actualizar(id: number, datos: ActualizarTratamientoDto): Promise<Tratamiento> {
    const tratamiento = await this.obtener(id);

    if (datos.enfermedadId !== undefined) {
      await this.verificarEnfermedadExiste(datos.enfermedadId);
      tratamiento.enfermedadId = datos.enfermedadId;
    }
    if (datos.nombre !== undefined) {
      tratamiento.nombre = datos.nombre.trim();
    }
    if (datos.descripcionAplicacion !== undefined) {
      tratamiento.descripcionAplicacion = datos.descripcionAplicacion.trim();
    }
    if (datos.tipo !== undefined) {
      tratamiento.tipo = datos.tipo;
    }

    return this.tratamientosRepository.save(tratamiento);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    const tratamiento = await this.obtener(id);
    await this.tratamientosRepository.remove(tratamiento);
    return { mensaje: `Tratamiento ${id} eliminado correctamente` };
  }

  private async verificarEnfermedadExiste(enfermedadId: number): Promise<void> {
    const enfermedad = await this.enfermedadesRepository.findOneBy({ id: enfermedadId });
    if (!enfermedad) {
      throw new NotFoundException(`No existe la enfermedad con id ${enfermedadId}`);
    }
  }
}