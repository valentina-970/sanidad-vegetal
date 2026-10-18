import { ApiProperty } from "@nestjs/swagger";

export class CrearBroteDto {
    @ApiProperty({ description: ' Id de la planta (debe existir)', example:1})
    plataId: number;

    @ApiProperty({ description: ' Id de la enfermedad (debe existir)', example:1})
    enfermedadId: number;
    
    @ApiProperty({ description: ' Id de la planta (debe existir)', example: 'Andina'})
    region: string;
    
    @ApiProperty({ description: ' Fecha del brote en formato YYYY-MM-DD (no futura)', example: '2026-05-10'})
    fecha: string;  
    
    @ApiProperty({ description: ' Hectàreas afectadas (debe ser mayor a 0)', example: 12.5})
    hectareas: number;    

}