import { ApiProperty } from '@nestjs/swagger';

export class ActualizarSusceptibilidadDto {
    @ApiProperty({ description: 'Id de la planta (debe existir)', required: false })
    plantaId?: number;

    @ApiProperty({ description: 'Id de la enfermedad (debe existir)', required: false })
    enfermedadId?: number;

    @ApiProperty({ description: 'Valores permitidos: baja, media, alta', required: false })
    nivel?: string;
}
