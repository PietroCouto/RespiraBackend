SELECT 
    json_agg(report) AS "airQualityHistory",
    json_build_object(
                'id', 		id,
                'name', 	name,
                'city', 	city,
                'state',	state,
                'cep', 		cep,
                'lat', 		lat,
                'long', 	long 
            ) AS "location",

            json_build_object(
                'id', 				arid,
                'date', 			ardate,
                'generalSeverity', 	"generalSeverity",
                'pollutants',
			        json_agg(
          		        json_build_object(
                            'id', 				rpid,
                            'name', 			pname,
                            'concentration', 	concentration,
                            'severity', 		severity
          		        )
        	        )
	        ) AS "airQualityReport"
    FROM (
        SELECT
            json_build_object(
                'id',              ar.id,
                'date',            ar.date,
                'generalSeverity', ar."generalSeverity",
                'pollutants',
                    json_agg(
                        json_build_object(
                            'id',               rp.id,
                            'name',             p.name,
                            'concentration',    rp.concentration,
                            'severity',         rp.severity
                        )
                    )
            ) AS "report",
			
			l.id,
            l.name,
            l.city,
          	l.state,
	      	l.cep,
	        l.lat,
            l.long,

			ar.id AS arid,
			ar.date AS ardate,
			ar."generalSeverity",

			rp.id AS rpid,
			p.name AS pname,
			concentration,
			severity
        FROM location l
        INNER JOIN air_quality_sensor s     ON s."locationId"           = l.id
        INNER JOIN air_quality_report ar    ON ar."sensorId"            = s.id
        INNER JOIN report_pollutant rp      ON rp."airQualityReportId"  = ar.id
        INNER JOIN pollutant p              ON p.id                     = rp."pollutantId"
        WHERE l.id = 123
        GROUP BY
            l.id,
            l.name,
            l.city,
            l.state,
            l.lat,
            l.long,
            ar.id,
            ar.date,
            ar."generalSeverity",
			rp.id,
			p.name
        ORDER BY ar.date DESC
        OFFSET 1
        LIMIT 7
    ) subquery

	GROUP BY
		id,
		name,
		city,
		state,
		cep,
		lat,
		long,
		arid,
		ardate,
		"generalSeverity"
		
	