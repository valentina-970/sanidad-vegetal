-- ==============================================================================
-- Datos de ejemplo - API Sanidad Vegetal
-- Ejecutar con la API apagada y después de que TypeORM haya creado las tablas.
-- ==============================================================================
USE `sanidad_vegetal`;
SET NAMES utf8mb4;

TRUNCATE TABLE brotes;
TRUNCATE TABLE susceptibilidades;
TRUNCATE TABLE tratamientos;
TRUNCATE TABLE cultivos;
TRUNCATE TABLE enfermedades;
TRUNCATE TABLE patogenos;
TRUNCATE TABLE plantas;

-- 1. PLANTAS (secuencias de 20 bases)
INSERT INTO plantas (id, nombreComun, nombreCientifico, familiaBotanica, tipoCultivo, secuenciaGenetica) VALUES
(1, 'Café Arábica', 'Coffea arabica', 'Rubiaceae', 'otro', 'ATGGCTAGCTAGGCTAACGT'),
(2, 'Maíz', 'Zea mays', 'Poaceae', 'cereal', 'ATGCGCGATATCGCGTACGT'),
(3, 'Aguacate Hass', 'Persea americana', 'Lauraceae', 'frutal', 'ATGTTCGAAGCTCGATCGAA'),
(4, 'Banano', 'Musa paradisiaca', 'Musaceae', 'frutal', 'ATGGGTACCATGCATGCAAT'),
(5, 'Tomate', 'Solanum lycopersicum', 'Solanaceae', 'hortaliza', 'ATGCCGTTAGCAGGTACCTA'),
(6, 'Rosa', 'Rosa chinensis', 'Rosaceae', 'ornamental', 'ATGCATTGCAAGTCCGATGA');

-- 2. PATÓGENOS
INSERT INTO patogenos (id, nombre, nombreCientifico, tipo, formaTransmision, secuenciaGenetica) VALUES
(1, 'Hongo de la roya', 'Hemileia vastatrix', 'hongo', 'viento', 'ATGCGATCGATCGATCGATCGATC'),
(2, 'Bacteria de la marchitez', 'Ralstonia solanacearum', 'bacteria', 'suelo', 'GCATGCATGCATGCATGCATGCAT'),
(3, 'Oomiceto de la pudrición', 'Phytophthora cinnamomi', 'oomiceto', 'agua', 'TTAGCGTTAACCGGTTACGTAACG'),
(4, 'Hongo de la Sigatoka', 'Pseudocercospora fijiensis', 'hongo', 'viento', 'CGATCGATATCGATCGATCGATCG'),
(5, 'Gusano cogollero', 'Spodoptera frugiperda', 'insecto', 'otro', 'ATGAAACGTTGCACGTTAGC'),
(6, 'Nematodo agallador', 'Meloidogyne incognita', 'nematodo', 'suelo', 'ATGTTGACCGTAGCTAGGCA');

-- 3. ENFERMEDADES
INSERT INTO enfermedades (id, nombre, sintomas, epocaRiesgo, patogenoId) VALUES
(1, 'Roya del café', 'Manchas cloróticas en el envés de las hojas con polvo anaranjado.', 'invierno', 1),
(2, 'Marchitez bacteriana', 'Marchitamiento rápido de hojas, decoloración vascular y exudado bacteriano.', 'verano', 2),
(3, 'Pudrición radicular del aguacate', 'Marchitez de la copa, necrosis foliar y pudrición de raíces absorbentes.', 'invierno', 3),
(4, 'Sigatoka negra', 'Puntos y rayas necróticas en las hojas que reducen la fotosíntesis.', 'todo_el_anio', 4),
(5, 'Daño por gusano cogollero', 'Perforaciones en el cogollo y hojas raspadas con excrementos visibles.', 'primavera', 5);

-- 4. TRATAMIENTOS
INSERT INTO tratamientos (id, nombre, descripcionAplicacion, tipo, enfermedadId) VALUES
(1, 'Oxicloruro de cobre', 'Aspersión foliar preventiva de 2.5 kg/ha cada 30 días en temporada de lluvias.', 'quimico', 1),
(2, 'Manejo de sombra y poda', 'Regular la sombra y podar para bajar la humedad relativa del cafetal.', 'cultural', 1),
(3, 'Rotación y desinfección', 'Rotar con gramíneas y desinfectar herramientas entre plantas afectadas.', 'cultural', 2),
(4, 'Trichoderma harzianum', 'Aplicar 1.0 L/ha al suelo alrededor de la zona radicular cada 60 días.', 'biologico', 3),
(5, 'Mancozeb 80% WP', 'Aspersión de 2.0 kg/ha alternando con fungicidas sistémicos para evitar resistencia.', 'quimico', 4),
(6, 'Bacillus thuringiensis', 'Aspersión dirigida al cogollo de 1.0 kg/ha al detectar las primeras larvas.', 'biologico', 5);

-- 5. CULTIVOS (semillas para probar /cultivos/:id/mutaciones)
INSERT INTO cultivos (id, plantaId, loteFinca, region, fechaSiembra, codigoGeneticoSemilla) VALUES
(1, 1, 'Finca La Esperanza - Sector Norte', 'Caldas', '2024-03-15', 'ATGGCTAGCTAGGCTAACGT'),
(2, 1, 'Finca El Cafetal - Sector Sur', 'Quindío', '2024-10-10', 'ATGACTAGCTTGGCTAACGA'),
(3, 2, 'Parcela San José', 'Tolima', '2026-07-20', 'ATGCGGGATATCGCGTACGT'),
(4, 3, 'Finca El Roble - Lote 3', 'Antioquia', '2023-05-12', 'ATGTTCGAAG'),
(5, 4, 'Hacienda Bananal', 'Magdalena', '2023-08-01', 'ATGGGTACCATGCATGCAAT'),
(6, 5, 'Invernadero Los Pinos', 'Boyacá', '2026-02-10', 'ATGCCGTTAGCAGGTACCTA');

-- 6. SUSCEPTIBILIDADES (planta + enfermedad, combinación única)
INSERT INTO susceptibilidades (id, plantaId, enfermedadId, nivel) VALUES
(1, 1, 1, 'alta'),
(2, 3, 3, 'alta'),
(3, 3, 2, 'baja'),
(4, 4, 4, 'alta'),
(5, 4, 2, 'media'),
(6, 5, 2, 'alta'),
(7, 2, 5, 'media');

-- 7. BROTES (fechas no futuras)
INSERT INTO brotes (id, plantaId, enfermedadId, fecha, region, hectareasAfectadas) VALUES
(1, 1, 1, '2026-09-10', 'Caldas', 2.30),
(2, 1, 1, '2026-05-22', 'Quindío', 1.75),
(3, 3, 3, '2026-06-15', 'Antioquia', 1.10),
(4, 4, 4, '2026-10-01', 'Magdalena', 4.50),
(5, 4, 4, '2026-03-18', 'Antioquia', 3.20),
(6, 5, 2, '2026-08-05', 'Boyacá', 0.80),
(7, 2, 5, '2026-07-30', 'Tolima', 6.00);
