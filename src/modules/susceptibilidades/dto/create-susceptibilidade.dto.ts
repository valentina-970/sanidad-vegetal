import {ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSusceptibilidadeDto {
    @ApiProperty({ example: 1, description: 'ID de la planta' })
    @IsNumber()
    @IsNotEmpty()
    plantaId: number;

    @ApiProperty({ example: 1, description: 'ID de la enfermedad' })
    @IsNumber()
    @IsNotEmpty()
    enfermedadId: number;

    @ApiProperty({ example: 'Alta', description: 'Nivel de susceptibilidad' })
    @IsNumber()
    @IsNotEmpty()
    nivel: string;

}
