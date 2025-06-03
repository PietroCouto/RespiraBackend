import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Location } from '.';

@Entity('air_quality_sensor')
export class AirQualitySensor {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'locationId' })
  locationId: Location;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'integer' })
  lat: number;

  @Column({ type: 'integer' })
  long: number;

  @Column({ type: 'varchar', length: 80 })
  source: string;
}
