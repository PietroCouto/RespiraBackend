import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  city: string;

  @Column({ type: 'varchar', length: 80 })
  state: string;

  @Column({ type: 'varchar', length: 15 })
  cep: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  long: number;
}
