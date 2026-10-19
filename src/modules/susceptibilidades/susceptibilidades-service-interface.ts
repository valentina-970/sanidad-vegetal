import type { ActualizarSusceptibilidadDto } from './dto/actualizar-susceptibilidad.dto.js';
import type { CrearSusceptibilidadDto } from './dto/crear-susceptibilidad.dto.js';
import type { Susceptibilidad } from './entities/susceptibilidades.entity.js';

export interface SusceptibilidadesServiceInterface {
  crear(datos: CrearSusceptibilidadDto): Promise<Susceptibilidad>;
  listar(plantaId?: number, enfermedadId?: number, nivel?: string): Promise<Susceptibilidad[]>;
  obtener(id: number): Promise<Susceptibilidad>;
  actualizar(id: number, datos: ActualizarSusceptibilidadDto): Promise<Susceptibilidad>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
