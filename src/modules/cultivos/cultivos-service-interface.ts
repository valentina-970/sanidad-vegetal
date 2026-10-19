import type { ActualizarCultivoDto } from './dto/actualizar-cultivo.dto.js';
import type { CrearCultivoDto } from './dto/crear-cultivo.dto.js';
import type { ResultadoMutacionesDto } from './dto/resultado-mutaciones.dto.js';
import type { Cultivo } from './entities/cultivos.entity.js';

export interface CultivosServiceInterface {
  crear(datos: CrearCultivoDto): Promise<Cultivo>;
  listar(plantaId?: number, region?: string, desde?: string, hasta?: string): Promise<Cultivo[]>;
  obtener(id: number): Promise<Cultivo>;
  actualizar(id: number, datos: ActualizarCultivoDto): Promise<Cultivo>;
  eliminar(id: number): Promise<{ mensaje: string }>;
  verificarMutaciones(id: number): Promise<ResultadoMutacionesDto>;
}
