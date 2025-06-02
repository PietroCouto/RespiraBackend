import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pollutant')
export class Pollutant {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 80 })
  name: string;
}
