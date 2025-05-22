import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  getLocationByName(name: string): Promise<Location | null> {
    return this.locationRepository.findOneBy({ name });
  }

  getLocationById(id: number): Promise<Location | null> {
    return this.locationRepository.findOneBy({ id });
  }
}
