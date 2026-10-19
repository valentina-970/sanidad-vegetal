import type { ActualizarEnfermedadDto } from './dto/actualizar-enfermedades.dto.js';
import type { CrearEnfermedadDto } from './dto/crear-enfermedades.dto.js';
import type { DetalleEnfermedadDto } from './dto/detalle-enfermedades.dto.js';
import type { Enfermedad } from './entities/enfermedades.entity.js';

export interface EnfermedadesServiceInterface {
  crear(datos: CrearEnfermedadDto): Promise<Enfermedad>;
  listar(epocaRiesgo?: string, patogenoId?: number): Promise<Enfermedad[]>;
  obtener(id: number): Promise<Enfermedad>;
  obtenerDetalle(id: number): Promise<DetalleEnfermedadDto>;
  actualizar(id: number, datos: ActualizarEnfermedadDto): Promise<Enfermedad>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
