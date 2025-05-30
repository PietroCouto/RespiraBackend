import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities';
import {
  CurrentLocationAirQualityDto,
  currentLocationAirHistoryDto,
} from './dto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private dataSource: DataSource,
  ) {}

  /**
   * Retrieves the latest air quality report for a specific location by name.
   * @param name - The name of the location.
   * @returns A promise that resolves to the latest air quality report for the location.
   */
  async getLatestLocationReport(
    name: string,
  ): Promise<CurrentLocationAirQualityDto> {
    // Query for the latest air quality report for the given location name
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

    // If no results are found, return an empty DTO
    if (!result[0]) result[0] = new CurrentLocationAirQualityDto();

    // THIS IS ABSOLUTELY TEMPORARY
    // TODO: REMOVE THIS
    // result[0].recommendations = [
    //   'Evite atividades ao ar livre durante o pico de poluição.',
    //   'Use máscara se necessário.',
    //   'Mantenha janelas fechadas para evitar a entrada de poluentes.',
    // ];

    // Convert the result to the DTO
    const dto: CurrentLocationAirQualityDto = plainToInstance(
      CurrentLocationAirQualityDto,
      result[0],
    );

    // Validate the DTO
    await validateOrReject(dto);

    // Return the data
    return dto;
  }

  /**
   * Retrieves the air quality report history for a specific location.
   * @param id - The ID of the location.
   * @returns A promise that resolves to the air quality report history for the location.
   */
  async getLocationReportHistory(
    id: bigint,
  ): Promise<currentLocationAirHistoryDto> {
    // Query for reports related to the location
    const result: currentLocationAirHistoryDto[] = await this.dataSource.query(
      `
        SELECT 
          json_agg(report) AS "reports"
        FROM (
          SELECT
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
            ) AS "report"
          FROM location l
          INNER JOIN air_quality_sensor s ON s."locationId" = l.id
          INNER JOIN air_quality_report ar ON ar."sensorId" = s.id
          INNER JOIN report_pollutant rp ON rp."airQualityReportId" = ar.id
          INNER JOIN pollutant p ON p.id = rp."pollutantId"
          WHERE l.id = $1
          GROUP BY
              l.id, l.name, l.city, l.state, l.lat, l.long,
              ar.id, ar.date, ar."generalSeverity"
          ORDER BY ar.date DESC
          OFFSET 1
          LIMIT 7
        )
    `,
      [id],
    );

    // SQL query returns an array in which reports may be null if no reports exist
    if (result[0].reports == null) {
      result[0].reports = [];
    }

    // Convert the result to the DTO
    const dto: currentLocationAirHistoryDto = plainToInstance(
      currentLocationAirHistoryDto,
      result[0],
    );

    // Validate the DTO
    await validateOrReject(dto);

    // Return the data
    return dto;
  }
}
