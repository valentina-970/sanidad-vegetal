import type { EstadisticaBrotesDto } from './dto/estadistica-brotes.dto.js';

export interface EstadisticasServiceInterface {
  porEnfermedad(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]>;
  porPatogeno(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]>;
  porRegion(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]>;
  porTipoCultivo(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]>;
  porMes(desde?: string, hasta?: string): Promise<EstadisticaBrotesDto[]>;
}
