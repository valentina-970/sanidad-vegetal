import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tratamientos')
export class Tratamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcionAplicacion: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'int' })
  enfermedadId: number;
}