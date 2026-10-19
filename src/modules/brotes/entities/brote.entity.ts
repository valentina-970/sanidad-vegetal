import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brotes')
export class Brote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  plantaId: number;

  @Column({ type: 'int' })
  enfermedadId: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: { to: (valor: number) => valor, from: (valor: string) => Number(valor) },
  })
  hectareasAfectadas: number;
}