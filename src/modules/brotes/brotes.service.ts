import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enfermedad } from '../enfermedades/entities/enfermedades.entity.js';
import { Patogeno } from '../patogenos/entities/patogenos.entity.js';
import { Planta } from '../plantas/entities/plantas.entity.js';
import { ActualizarBroteDto } from './dto/actualizar-brote.dto.js';
import { CrearBroteDto } from './dto/crear-brote.dto.js';
import { Brote } from './entities/brote.entity.js';
import type { BroteDetalle, BrotesServiceInterface } from './brotes-service-interface.js';

@Injectable()
export class BrotesService implements BrotesServiceInterface {
  constructor(
    @InjectRepository(Brote)
    private readonly broteRepository: Repository<Brote>,
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(Enfermedad)
    private readonly enfermedadRepository: Repository<Enfermedad>,
    @InjectRepository(Patogeno)
    private readonly patogenoRepository: Repository<Patogeno>,
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

  async crear(dto: CrearBroteDto): Promise<Brote> {
    await this.verificarReferencias(dto.plantaId, dto.enfermedadId);
    const brote = this.broteRepository.create({
      plantaId: dto.plantaId,
      enfermedadId: dto.enfermedadId,
      fecha: dto.fecha,
      region: dto.region.trim(),
      hectareasAfectadas: dto.hectareasAfectadas,
    });
    return this.broteRepository.save(brote);
  }

  async listar(
    plantaId?: number,
    enfermedadId?: number,
    region?: string,
    desde?: string,
    hasta?: string,
  ): Promise<Brote[]> {
    const query = this.broteRepository.createQueryBuilder('brote');

    if (plantaId !== undefined) {
      query.andWhere('brote.plantaId = :plantaId', { plantaId });
    }
    if (enfermedadId !== undefined) {
      query.andWhere('brote.enfermedadId = :enfermedadId', { enfermedadId });
    }
    if (region !== undefined) {
      query.andWhere('LOWER(brote.region) LIKE LOWER(:region)', { region: `%${region.trim()}%` });
    }
    if (desde !== undefined) {
      query.andWhere('brote.fecha >= :desde', { desde });
    }
    if (hasta !== undefined) {
      query.andWhere('brote.fecha <= :hasta', { hasta });
    }

    return query.orderBy('brote.fecha', 'DESC').getMany();
  }

  async listarDetalle(region?: string, desde?: string, hasta?: string): Promise<BroteDetalle[]> {
    const brotes = await this.listar(undefined, undefined, region, desde, hasta);

    const [plantas, enfermedades, patogenos] = await Promise.all([
      this.plantaRepository.find(),
      this.enfermedadRepository.find(),
      this.patogenoRepository.find(),
    ]);
    const plantasPorId = new Map(plantas.map((p) => [p.id, p]));
    const enfermedadesPorId = new Map(enfermedades.map((e) => [e.id, e]));
    const patogenosPorId = new Map(patogenos.map((p) => [p.id, p]));

    return brotes.map((brote) => {
      const enfermedad = enfermedadesPorId.get(brote.enfermedadId);
      const patogeno = enfermedad ? patogenosPorId.get(enfermedad.patogenoId) : undefined;
      return {
        ...brote,
        nombrePlanta: plantasPorId.get(brote.plantaId)?.nombreComun ?? null,
        nombreEnfermedad: enfermedad?.nombre ?? null,
        nombrePatogeno: patogeno?.nombre ?? null,
      };
    });
  }

  async obtener(id: number): Promise<Brote> {
    const brote = await this.broteRepository.findOne({ where: { id } });
    if (!brote) {
      throw new NotFoundException(`No existe el brote con el id ${id}`);
    }
    return brote;
  }

  async actualizar(id: number, dto: ActualizarBroteDto): Promise<Brote> {
    const brote = await this.obtener(id);
    await this.verificarReferencias(dto.plantaId, dto.enfermedadId);

    if (dto.plantaId !== undefined) {
      brote.plantaId = dto.plantaId;
    }
    if (dto.enfermedadId !== undefined) {
      brote.enfermedadId = dto.enfermedadId;
    }
    if (dto.fecha !== undefined) {
      brote.fecha = dto.fecha;
    }
    if (dto.region !== undefined) {
      brote.region = dto.region.trim();
    }
    if (dto.hectareasAfectadas !== undefined) {
      brote.hectareasAfectadas = dto.hectareasAfectadas;
    }

    return this.broteRepository.save(brote);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    await this.obtener(id);
    await this.broteRepository.delete(id);
    return { mensaje: `Brote con id ${id} eliminado exitosamente` };
  }
}
