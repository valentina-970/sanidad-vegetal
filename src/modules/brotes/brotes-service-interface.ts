import type { ActualizarBroteDto } from './dto/actualizar-brote.dto.js';
import type { CrearBroteDto } from './dto/crear-brote.dto.js';
import type { Brote } from './entities/brote.entity.js';

export type BroteDetalle = Brote & {
  nombrePlanta: string | null;
  nombreEnfermedad: string | null;
  nombrePatogeno: string | null;
};

export interface BrotesServiceInterface {
  crear(dto: CrearBroteDto): Promise<Brote>;
  listar(plantaId?: number, enfermedadId?: number, region?: string, desde?: string, hasta?: string): Promise<Brote[]>;
  listarDetalle(region?: string, desde?: string, hasta?: string): Promise<BroteDetalle[]>;
  obtener(id: number): Promise<Brote>;
  actualizar(id: number, dto: ActualizarBroteDto): Promise<Brote>;
  eliminar(id: number): Promise<{ mensaje: string }>;
}
