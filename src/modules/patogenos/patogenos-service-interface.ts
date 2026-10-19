import type { ActualizarPatogenoDto } from './dto/actualizar-patogeno.dto.js';
import type { CrearPatogenoDto } from './dto/crear-patogeno.dto.js';
import type { Patogeno } from './entities/patogenos.entity.js';

export interface PatogenosServiceInterface {
  crear(datos: CrearPatogenoDto): Promise<Patogeno>;
  listar(tipo?: string, formaTransmision?: string): Promise<Patogeno[]>;
  obtener(id: number): Promise<Patogeno>;
  actualizar(id: number, datos: ActualizarPatogenoDto): Promise<Patogeno>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
