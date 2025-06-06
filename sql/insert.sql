INSERT INTO LOCATION VALUES
(
	123,
	'Bairro Vila Ipiranga',
    'Porto Alegre',
    'RS',
    '91310-000',
    -30.027542,
    -51.175467
);

INSERT INTO AIR_QUALITY_SENSOR VALUES
(
	1,
	'Bairro Vila Ipiranga',
	-30.027542,
    -51.175467,
	'Arduino',
	123

);

INSERT INTO AIR_QUALITY_REPORT VALUES
(
	456,
	'2025-05-09T12:00:00Z',
	'MEDIUM',
	1
);

INSERT INTO POLLUTANT VALUES
(
	1,
	'CO₂'
);

INSERT INTO POLLUTANT VALUES
(
	2,
	'SO₂'
);

INSERT INTO POLLUTANT VALUES
(
	3,
	'NO₂'
);
	
INSERT INTO REPORT_POLLUTANT VALUES
(
	1,
	'10 µg/m³',
	'MEDIUM',
	456,
	1
);

INSERT INTO REPORT_POLLUTANT VALUES
(
	2,
	'25 µg/m³',
	'LOW',
	456,
	2
);

INSERT INTO REPORT_POLLUTANT VALUES
(
	3,
	'85 µg/m³',
	'HIGH',
	456,
	3
);
