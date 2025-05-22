import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Location } from './main';

@Entity('air_quality_sensor')
export class AirQualitySensor {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'locationId' })
  locationId: Location;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'bigint' })
  lat: bigint;

  @Column({ type: 'bigint' })
  long: bigint;

  @Column({ type: 'varchar', length: 80 })
  source: string;
}
