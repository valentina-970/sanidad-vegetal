import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('susceptibilidades')
export class Susceptibilidades{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plantaId: number;

    @Column()
    enfermedadId: number;

    @Column()
    nivel: string;
}
