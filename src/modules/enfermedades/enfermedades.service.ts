import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearEnfermedadDto } from './dto/crear-enfermedades.dto';
import { ActualizarEnfermedadDto } from './dto/actualizar-enfermedades.dto';
import { Enfermedad } from './entities/enfermedades.entity';
import { Patogeno } from '../patogenos/entities/patogenos.entity';

@Injectable()
export class EnfermedadesService {
  constructor(
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,
    @InjectRepository(Patogeno)
    private readonly patogenosRepository: Repository<Patogeno>,
  ) {}

  async crear(datos: CrearEnfermedadDto): Promise<Enfermedad> {
    await this.verificarPatogenoExiste(datos.patogenoId);

    const enfermedad = this.enfermedadesRepository.create({
      nombre: datos.nombre.trim(),
      sintomas: datos.sintomas.trim(),
      epocaRiesgo: datos.epocaRiesgo,
      patogenoId: datos.patogenoId,
    });
    return this.enfermedadesRepository.save(enfermedad);
  }

  async listar(epocaRiesgo?: string, patogenoId?: number): Promise<Enfermedad[]> {
    const filtros: { epocaRiesgo?: string; patogenoId?: number } = {};
    if (epocaRiesgo !== undefined) {
      filtros.epocaRiesgo = epocaRiesgo;
    }
    if (patogenoId !== undefined) {
      filtros.patogenoId = patogenoId;
    }
    return this.enfermedadesRepository.find({ where: filtros });
  }

  async obtener(id: number): Promise<Enfermedad> {
    const enfermedad = await this.enfermedadesRepository.findOneBy({ id });
    if (!enfermedad) {
      throw new NotFoundException(`No existe la enfermedad con id ${id}`);
    }
    return enfermedad;
  }

  async actualizar(id: number, datos: ActualizarEnfermedadDto): Promise<Enfermedad> {
    const enfermedad = await this.obtener(id);

    if (datos.patogenoId !== undefined) {
      await this.verificarPatogenoExiste(datos.patogenoId);
      enfermedad.patogenoId = datos.patogenoId;
    }
    if (datos.nombre !== undefined) {
      enfermedad.nombre = datos.nombre.trim();
    }
    if (datos.sintomas !== undefined) {
      enfermedad.sintomas = datos.sintomas.trim();
    }
    if (datos.epocaRiesgo !== undefined) {
      enfermedad.epocaRiesgo = datos.epocaRiesgo;
    }

    return this.enfermedadesRepository.save(enfermedad);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    const enfermedad = await this.obtener(id);
    await this.enfermedadesRepository.remove(enfermedad);
    return { mensaje: `Enfermedad ${id} eliminada correctamente` };
  }

  private async verificarPatogenoExiste(patogenoId: number): Promise<void> {
    const patogeno = await this.patogenosRepository.findOneBy({ id: patogenoId });
    if (!patogeno) {
      throw new NotFoundException(`No existe el patógeno con id ${patogenoId}`);
    }
  }
}