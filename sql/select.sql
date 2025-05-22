SELECT
	json_build_object(
		'id', 		l.id,
	    'name', 	l.name,
	    'city', 	l.city,
		'state',	l.state,
	    'lat', l.lat,
		'long', l.long 
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
            		'severity', rp.severity
          		)
        	)
	) AS "airQualityReport"
FROM location l
INNER JOIN air_quality_sensor s ON s."locationId" = l.id
INNER JOIN air_quality_report ar ON ar."sensorId" = s.id
INNER JOIN report_pollutant rp ON rp."airQualityReportId" = ar.id
INNER JOIN pollutant p ON p.id = rp."pollutantId"
WHERE l.name = 'Bairro Vila Ipiranga'
GROUP BY
l.id, l.name, l.city, l.state, l.lat, l.long,
ar.id, ar.date, ar."generalSeverity"
ORDER BY ar.date DESC