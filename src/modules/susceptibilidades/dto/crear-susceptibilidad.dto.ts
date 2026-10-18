import { ApiProperty } from '@nestjs/swagger';

export class CrearSusceptibilidadDto {
    @ApiProperty({ description: 'Id de la planta (debe existir)', example: 1 })
    plantaId: number;

    @ApiProperty({ description: 'Id de la enfermedad (debe existir)', example: 1 })
    enfermedadId: number;

    @ApiProperty({ description: 'Valores permitidos: baja, media, alta', example: 'alta' })
    nivel: string;
}
