import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brotes')
export class Brote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plantaId: number;

  @Column()
  enfermedadId: number;

  @Column({ length: 100 })
  region: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hectareas: number;
}