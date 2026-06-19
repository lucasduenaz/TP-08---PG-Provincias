-- ============================================
-- TP04 - Script de creación de Base de Datos
-- ============================================

-- 1) Creá la base de datos ejecutando esta línea
--    DESDE pgAdmin (Query Tool en la base "postgres")
--    o desde la consola psql.
--
--    CREATE DATABASE tp04_province;
--
-- Luego conectate a la base "tp04_province" y ejecutá el resto.

-- 2) Creación de la tabla provinces
CREATE TABLE IF NOT EXISTS provinces (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    full_name      VARCHAR(150) NOT NULL,
    latitude       DOUBLE PRECISION NOT NULL,
    longitude      DOUBLE PRECISION NOT NULL,
    display_order  INTEGER DEFAULT 0
);

-- 3) Datos de ejemplo (provincias argentinas)
INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES
('Buenos Aires',       'Provincia de Buenos Aires',       -36.6769, -60.5588, 10),
('Córdoba',            'Provincia de Córdoba',            -31.4201, -64.1888, 20),
('Santa Fe',           'Provincia de Santa Fe',           -31.6107, -60.6973, 30),
('Mendoza',            'Provincia de Mendoza',            -34.6177, -68.3539, 40),
('Chaco',              'Provincia de Chaco',              -26.6228, -60.5547, 50),
('Salta',              'Provincia de Salta',              -24.7821, -65.4232, 60),
('Misiones',           'Provincia de Misiones',           -26.8753, -54.5544, 70),
('Neuquén',            'Provincia de Neuquén',            -38.9516, -68.0591, 80),
('Tucumán',            'Provincia de Tucumán',            -26.8083, -65.2176, 90),
('Entre Ríos',         'Provincia de Entre Ríos',         -32.0667, -59.0500, 100);
