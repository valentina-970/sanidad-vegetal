import type { ActualizarTratamientoDto } from './dto/actualizar-tratamientos.dto.js';
import type { CrearTratamientoDto } from './dto/crear-tratamientos.dto.js';
import type { Tratamiento } from './entities/tratamientos.entity.js';

export interface TratamientosServiceInterface {
  crear(datos: CrearTratamientoDto): Promise<Tratamiento>;
  listar(tipo?: string, enfermedadId?: number): Promise<Tratamiento[]>;
  obtener(id: number): Promise<Tratamiento>;
  actualizar(id: number, datos: ActualizarTratamientoDto): Promise<Tratamiento>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
