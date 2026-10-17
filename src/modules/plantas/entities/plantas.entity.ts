import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plantas')
export class Planta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombreComun: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    nombreCientifico: string;

    @Column({ type: 'varchar', length: 100 })
    familiaBotanica: string;

    @Column({ type: 'varchar', length: 20 })
    tipoCultivo: string;

    @Column({ type: 'text' })
    secuenciaGenetica: string;
}
