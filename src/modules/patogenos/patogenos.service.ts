import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActualizarPatogenoDto } from './dto/actualizar-patogeno.dto.js';
import { CrearPatogenoDto } from './dto/crear-patogeno.dto.js';
import { Patogeno } from './entities/patogenos.entity.js';

@Injectable()
export class PatogenosService {
  constructor(
    @InjectRepository(Patogeno)
    private readonly patogenosRepository: Repository<Patogeno>,
  ) {}

  async crear(datos: CrearPatogenoDto): Promise<Patogeno> {
    const nombreCientifico = datos.nombreCientifico.trim();
    await this.verificarNombreCientificoLibre(nombreCientifico);

    const patogeno = this.patogenosRepository.create({
      nombre: datos.nombre.trim(),
      nombreCientifico,
      tipo: datos.tipo,
      formaTransmision: datos.formaTransmision,
      secuenciaGenetica: datos.secuenciaGenetica,
    });
    return this.patogenosRepository.save(patogeno);
  }

  async listar(tipo?: string, formaTransmision?: string): Promise<Patogeno[]> {
    const filtros: { tipo?: string; formaTransmision?: string } = {};
    if (tipo !== undefined) {
      filtros.tipo = tipo;
    }
    if (formaTransmision !== undefined) {
      filtros.formaTransmision = formaTransmision;
    }
    return this.patogenosRepository.find({ where: filtros });
  }

  async obtener(id: number): Promise<Patogeno> {
    const patogeno = await this.patogenosRepository.findOneBy({ id });
    if (!patogeno) {
      throw new NotFoundException(`No existe el patógeno con id ${id}`);
    }
    return patogeno;
  }

  async actualizar(id: number, datos: ActualizarPatogenoDto): Promise<Patogeno> {
    const patogeno = await this.obtener(id);

    if (datos.nombreCientifico !== undefined) {
      const nuevoNombreCientifico = datos.nombreCientifico.trim();
      if (nuevoNombreCientifico !== patogeno.nombreCientifico) {
        await this.verificarNombreCientificoLibre(nuevoNombreCientifico);
      }
      patogeno.nombreCientifico = nuevoNombreCientifico;
    }
    if (datos.nombre !== undefined) {
      patogeno.nombre = datos.nombre.trim();
    }
    if (datos.tipo !== undefined) {
      patogeno.tipo = datos.tipo;
    }
    if (datos.formaTransmision !== undefined) {
      patogeno.formaTransmision = datos.formaTransmision;
    }
    if (datos.secuenciaGenetica !== undefined) {
      patogeno.secuenciaGenetica = datos.secuenciaGenetica;
    }

    return this.patogenosRepository.save(patogeno);
  }

  async eliminar(id: number): Promise<{ mensaje: string }> {
    const patogeno = await this.obtener(id);
    await this.patogenosRepository.remove(patogeno);
    return { mensaje: `Patógeno ${id} eliminado correctamente` };
  }

  private async verificarNombreCientificoLibre(nombreCientifico: string): Promise<void> {
    const existente = await this.patogenosRepository.findOneBy({ nombreCientifico });
    if (existente) {
      throw new ConflictException(
        `Ya existe un patógeno con el nombre científico ${nombreCientifico}`,
      );
    }
  }
}