import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('susceptibilidades')
export class Susceptibilidade{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plantaId: number;

    @Column()
    enfermedadId: number;

    @Column()
    nivel: string;
}
