import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pollutant')
export class Pollutant {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 80 })
  name: string;
}
