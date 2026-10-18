import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Enfermedad } from '../../enfermedades/entities/enfermedades.entity.js';
import { Planta } from '../../plantas/entities/plantas.entity.js';

@Entity('brotes')
export class Brote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'planta_id' })
  plantaId: number;

  @Column({ name: 'enfermedad_id' })
  enfermedadId: number;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'varchar', length: 10 })
  fecha: string;

  @Column({ type: 'float' })
  hectareas: number;

  @ManyToOne(() => Planta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planta_id' })
  planta: Planta;

  @ManyToOne(() => Enfermedad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enfermedad_id' })
  enfermedad: Enfermedad;
}