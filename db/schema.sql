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

INSERT INTO vehiculos (marca, modelo, precio, motor, etiqueta, plazas, detalles) VALUES
('Skoda',      'Octavia TDI',    24900, 'Diesel',    'C',    5, 'La berlina más racional del mercado. Maletero XXL y bajo consumo en ruta.'),
('Nissan',     'Qashqai dCi',    29500, 'Diesel',    'C',    5, 'El SUV que inventó el segmento. Fiable, espacioso y eficiente en autovía.'),
('Fiat',       '500e',           24500, 'Electrico', 'ZERO', 4, 'El icono italiano reinventado. Ideal para ciudad con etiqueta ZERO.'),
('Tesla',      'Model 3',        42900, 'Electrico', 'ZERO', 5, 'El eléctrico de referencia. Autopilot, 500 km de autonomía y rendimiento brutal.'),
('Kia',        'EV6',            45000, 'Electrico', 'ZERO', 5, 'Carga ultrarrápida en 18 minutos. El eléctrico más tecnológico de su segmento.'),
('Citroën',    'C5 Aircross',    31000, 'Hibrid',    'ECO',  5, 'El SUV más confortable de Francia. Suspensión hidráulica y habitáculo premium.'),
('Kia',        'Sorento PHEV',   52000, 'Hibrid',    'ECO',  7, 'SUV familiar enchufable de 7 plazas. Todo terreno suave con zero en ciudad.'),
('Ford',       'S-Max',          36000, 'Diesel',    'C',    7, 'El monovolumen deportivo. 7 plazas reales con conducción dinámica.'),
('Dacia',      'Spring',          9900, 'Electrico', 'ZERO', 4, 'El eléctrico más barato de Europa. Ciudad pura sin complicaciones.'),
('Volkswagen', 'Polo',           15000, 'Gasolina',  'ECO',  5, 'Un Golf más pequeño y asequible. Calidad alemana en formato urbano.'),
('Toyota',     'GR86',           32500, 'Gasolina',  'C',    4, 'Deportivo puro de tracción trasera. Heredero espiritual del AE86.'),
('Alpine',     'A110',           62000, 'Gasolina',  'C',    2, 'El deportivo europeo más puro. Ligero, rápido y con alma de piloto.'),
('Toyota',     'Camry Hybrid',   37000, 'Hibrid',    'ECO',  5, 'La berlina híbrida más fiable del mundo. Cero averías, máximo confort.'),
('Honda',      'Accord Hybrid',  39500, 'Hibrid',    'ECO',  5, 'Berlina ejecutiva híbrida. Silenciosa, espaciosa y con acabados premium.'),
('Dacia',      'Duster',         18500, 'Gasolina',  'B',    5, 'El SUV barato que conquista cualquier terreno. Sin lujos, con carácter.'),
('Jeep',       'Renegade',       22000, 'Gasolina',  'B',    5, 'Pequeño por fuera, aventurero por dentro. Capacidad offroad en formato urbano.');

-- Admin de prueba (password: Admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin RWA', 'admin@redwire.auto', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');
