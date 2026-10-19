import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('patogenos')
export class Patogeno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  nombreCientifico: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'varchar', length: 30 })
  formaTransmision: string;

  @Column({ type: 'text' })
  secuenciaGenetica: string;
}
