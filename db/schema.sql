-- Red Wire Auto — Schema MySQL
CREATE DATABASE IF NOT EXISTS redwire_auto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE redwire_auto;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  rol        ENUM('admin','user') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehiculos (
  id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
  marca       VARCHAR(50)   NOT NULL,
  modelo      VARCHAR(50)   NOT NULL,
  precio      DECIMAL(10,2) NOT NULL,
  motor       VARCHAR(50)   NOT NULL,
  etiqueta    VARCHAR(10)   NOT NULL,
  plazas      INT           NOT NULL,
  detalles    TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tests (
  id_test     INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario  INT           NOT NULL,
  id_vehiculo INT           NOT NULL,
  afinidad    DECIMAL(5,2)  NOT NULL,
  fecha       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario)  REFERENCES usuarios(id_usuario)  ON DELETE CASCADE,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoritos (
  id_usuario  INT NOT NULL,
  id_vehiculo INT NOT NULL,
  added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario, id_vehiculo),
  FOREIGN KEY (id_usuario)  REFERENCES usuarios(id_usuario)  ON DELETE CASCADE,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE
);

INSERT INTO vehiculos (marca, modelo, precio, motor, etiqueta, plazas, detalles) VALUES
('Toyota',     'Yaris',          18500, 'Gasolina',  'ECO',  5, 'Compacto urbano de bajo consumo. Perfecto para ciudad.'),
('Toyota',     'RAV4 Hybrid',    38900, 'Hibrid',    'ECO',  5, 'SUV híbrido familiar. Gran equilibrio espacio y eficiencia.'),
('Volkswagen', 'Golf',           26500, 'Gasolina',  'C',    5, 'El compacto europeo de referencia. Polivalente y fiable.'),
('Volkswagen', 'ID.4',           42000, 'Electrico', 'ZERO', 5, 'SUV eléctrico puro con gran autonomía.'),
('Seat',       'Ibiza',          16900, 'Gasolina',  'ECO',  5, 'Urbano, dinámico y asequible.'),
('Seat',       'Tarraco',        33500, 'Diesel',    'C',    7, 'SUV de 7 plazas ideal para familias numerosas.'),
('Renault',    'Clio',           17200, 'Gasolina',  'ECO',  5, 'Carácter francés con gran relación calidad-precio.'),
('Renault',    'Zoe',            28000, 'Electrico', 'ZERO', 5, 'Pionero eléctrico urbano. Coste de uso mínimo.'),
('BMW',        '320d',           48000, 'Diesel',    'C',    5, 'Berlina premium. Deportividad y eficiencia.'),
('Peugeot',    '208',            19500, 'Gasolina',  'ECO',  5, 'Diseño rompedor con i-Cockpit moderno.'),
('Mazda',      'MX-5',           32000, 'Gasolina',  'C',    2, 'El roadster puro. Para el aficionado que no transige.'),
('Ford',       'Kuga PHEV',      37500, 'Hibrid',    'ECO',  5, 'SUV enchufable. Eléctrico en ciudad, gasolina en ruta.'),
('Dacia',      'Sandero',        11900, 'Gasolina',  'ECO',  5, 'El más económico del mercado. Sin florituras.'),
('Hyundai',    'Tucson Hybrid',  35000, 'Hibrid',    'ECO',  5, 'SUV híbrido completo con garantía de 5 años.');

-- Admin de prueba (password: Admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin RWA', 'admin@redwire.auto', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');
