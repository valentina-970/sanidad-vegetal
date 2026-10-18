import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('susceptibilidades')
@Unique(['plantaId', 'enfermedadId'])
export class Susceptibilidad {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    plantaId: number;

    @Column({ type: 'int' })
    enfermedadId: number;

    @Column({ type: 'varchar', length: 10 })
    nivel: string;
}
