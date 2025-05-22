import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities';
import { CurrentLocationAirQualityDto } from './dto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

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
    const result: CurrentLocationAirQualityDto[] = await this.dataSource.query(
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
          LIMIT 1
    `,
      [name],
    );

    if (!result[0]) return null;

    // THIS IS ABSOLUTELY TEMPORARY
    // TODO: REMOVE THIS
    result[0].recommendations = [
      'Evite atividades ao ar livre durante o pico de poluição.',
      'Use máscara se necessário.',
      'Mantenha janelas fechadas para evitar a entrada de poluentes.',
    ];

    const dto: CurrentLocationAirQualityDto = plainToInstance(
      CurrentLocationAirQualityDto,
      result[0],
    );

    await validateOrReject(dto);

    return dto;
  }
}
