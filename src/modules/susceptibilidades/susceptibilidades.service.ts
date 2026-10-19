import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { ActualizarSusceptibilidadDto } from './dto/actualizar-susceptibilidad.dto.js';
import { CrearSusceptibilidadDto } from './dto/crear-susceptibilidad.dto.js';
import { Susceptibilidad } from './entities/susceptibilidades.entity.js';

@Injectable()
export class SusceptibilidadesService {
  constructor(
    @InjectRepository(Susceptibilidad)
    private readonly susceptibilidadesRepository: Repository<Susceptibilidad>,
    @InjectRepository(Planta)
    private readonly plantasRepository: Repository<Planta>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,
  ) { }

  async crear(datos: CrearSusceptibilidadDto): Promise<Susceptibilidad> {
    await this.verificarReferencias(datos.plantaId, datos.enfermedadId);
    await this.verificarCombinacionLibre(datos.plantaId, datos.enfermedadId);

    const susceptibilidad = this.susceptibilidadesRepository.create({
      plantaId: datos.plantaId,
      enfermedadId: datos.enfermedadId,
      nivel: datos.nivel,
    });
    return this.susceptibilidadesRepository.save(susceptibilidad);
  }

  async listar(plantaId?: number, enfermedadId?: number, nivel?: string): Promise<Susceptibilidad[]> {
    const filtros: FindOptionsWhere<Susceptibilidad> = {};
    if (plantaId !== undefined) {
      filtros.plantaId = plantaId;
    }
    if (enfermedadId !== undefined) {
      filtros.enfermedadId = enfermedadId;
    }
    if (nivel !== undefined) {
      filtros.nivel = nivel;
    }
    return this.susceptibilidadesRepository.find({ where: filtros });
  }

  async obtener(id: number): Promise<Susceptibilidad> {
    const susceptibilidad = await this.susceptibilidadesRepository.findOneBy({ id });
    if (!susceptibilidad) {
      throw new NotFoundException(`No existe la susceptibilidad con id ${id}`);
    }
    return susceptibilidad;
  }

  async actualizar(id: number, datos: ActualizarSusceptibilidadDto): Promise<Susceptibilidad> {
    const susceptibilidad = await this.obtener(id);

    if (datos.plantaId !== undefined || datos.enfermedadId !== undefined) {
      await this.verificarReferencias(datos.plantaId, datos.enfermedadId);

      const plantaId = datos.plantaId ?? susceptibilidad.plantaId;
      const enfermedadId = datos.enfermedadId ?? susceptibilidad.enfermedadId;
      if (plantaId !== susceptibilidad.plantaId || enfermedadId !== susceptibilidad.enfermedadId) {
        await this.verificarCombinacionLibre(plantaId, enfermedadId);
      }
      susceptibilidad.plantaId = plantaId;
      susceptibilidad.enfermedadId = enfermedadId;
    }
    if (datos.nivel !== undefined) {
      susceptibilidad.nivel = datos.nivel;
    }

    return this.susceptibilidadesRepository.save(susceptibilidad);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    const susceptibilidad = await this.obtener(id);
    await this.susceptibilidadesRepository.remove(susceptibilidad);
    return { mensaje: `Susceptibilidad ${id} eliminada correctamente` };
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

  private async verificarCombinacionLibre(plantaId: number, enfermedadId: number): Promise<void> {
    const existente = await this.susceptibilidadesRepository.findOneBy({ plantaId, enfermedadId });
    if (existente) {
      throw new ConflictException(
        `Ya existe una susceptibilidad para la planta ${plantaId} y la enfermedad ${enfermedadId} (id ${existente.id})`,
      );
    }
  }
}
