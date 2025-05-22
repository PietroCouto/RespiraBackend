import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities';
import { CurrentLocationAirQualityDto } from './dto';
import { DataSource } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private dataSource: DataSource,
  ) {}

  async getLocationByName(name: string): Promise<Location | null> {
    return this.locationRepository.findOneBy({ name });
  }

  async getLocationById(id: bigint): Promise<Location | null> {
    return this.locationRepository.findOneBy({ id });
  }

  async getLatestLocationReport(
    name: string,
  ): Promise<CurrentLocationAirQualityDto | null> {
    return this.dataSource
      .query(
        `
          SELECT
            json_build_object(
              'id', 		l.id,
              'name', 	l.name,
              'city', 	l.city,
              'state',	l.state,
              'cep', 	  l.cep,
              'lat',    l.lat,
              'long',   l.long 
            ) AS "location",

              json_build_object(
                'id', ar.id,
                  'date', ar.date,
                  'generalSeverity', ar."generalSeverity",
              'pollutants',
                json_agg(
                        json_build_object(
                          'id', rp.id,
                          'name', p.name,
                          'concentration', rp.concentration,
                          'severity', rp.severity
                        )
                    )
            ) AS "airQualityReport"
          FROM location l
          INNER JOIN air_quality_sensor s ON s."locationId" = l.id
          INNER JOIN air_quality_report ar ON ar."sensorId" = s.id
          INNER JOIN report_pollutant rp ON rp."airQualityReportId" = ar.id
          INNER JOIN pollutant p ON p.id = rp."pollutantId"
          WHERE l.name = $1
          GROUP BY
          l.id, l.name, l.city, l.state, l.lat, l.long,
          ar.id, ar.date, ar."generalSeverity"
          ORDER BY ar.date DESC
    `,
        [name],
      )
      .then((rows: CurrentLocationAirQualityDto[]) => rows[0] || null); // Return single result or null
  }
}
