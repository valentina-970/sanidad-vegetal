import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Susceptibilidades} from './entities/susceptibilidade.entity';
import { CreateSusceptibilidadeDto } from './dto/create-susceptibilidade.dto';
import { UpdateSusceptibilidadeDto } from './dto/update-susceptibilidade.dto';

@Injectable()
export class SusceptibilidadesService {
  constructor(
    @InjectRepository(Susceptibilidades)
    private readonly susceptibilidadRepository: Repository<Susceptibilidades>,
  ) {}

  async create(createDto: CreateSusceptibilidadeDto): Promise<Susceptibilidades>{
    const susceptibilidad = this.susceptibilidadRepository.create(createDto);
    return await this.susceptibilidadRepository.save(susceptibilidad);
  }

  async findAll(): Promise<Susceptibilidades[]>{
    return await this.susceptibilidadRepository.find();
  }

  async findOne(id: number): Promise<Susceptibilidades>{
    const susceptibilidad = await this.susceptibilidadRepository.findOneBy({ id });
    if (!susceptibilidad) {
      throw new NotFoundException(`Susceptibilidad con ID ${id} no encontrada`);
    }
    return susceptibilidad;
  }

  async update(id: number, updateDto: UpdateSusceptibilidadeDto): Promise<Susceptibilidades>{
    const susceptibilidad = await this.findOne(id);
    this.susceptibilidadRepository.merge(susceptibilidad, updateDto);
    return await this.susceptibilidadRepository.save(susceptibilidad);
  }

  async remove(id: number): Promise<{ message: string }> {
    const susceptibilidad = await this.findOne(id);
    await this.susceptibilidadRepository.remove(susceptibilidad);
    return { message: `Susceptibilidad con ID ${id} eliminada correctamente` };
  }
}