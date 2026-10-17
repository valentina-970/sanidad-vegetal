import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('enfermedades')
export class Enfermedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  sintomas: string;

  @Column({ type: 'varchar', length: 20 })
  epocaRiesgo: string;

  @Column({ type: 'int' })
  patogenoId: number;
}
