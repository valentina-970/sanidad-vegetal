import type { ActualizarPlantaDto } from './dto/actualizar-planta.dto.js';
import type { CrearPlantaDto } from './dto/crear-planta.dto.js';
import type { FichaPlantaDto } from './dto/ficha-planta.dto.js';
import type { Planta } from './entities/plantas.entity.js';

export interface PlantasServiceInterface {
  crear(datos: CrearPlantaDto): Promise<Planta>;
  listar(tipoCultivo?: string, familiaBotanica?: string, nombre?: string): Promise<Planta[]>;
  obtener(id: number): Promise<Planta>;
  obtenerFicha(id: number): Promise<FichaPlantaDto>;
  actualizar(id: number, datos: ActualizarPlantaDto): Promise<Planta>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
