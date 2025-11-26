CREATE TABLE concesionarios (
    id_concesionario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono_contacto VARCHAR(20) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('empleado', 'admin') NOT NULL DEFAULT 'empleado',
    telefono VARCHAR(20) NULL,
    id_concesionario INT UNSIGNED NOT NULL,
    preferencias_accesibilidad JSON NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_concesionario) REFERENCES concesionarios(id_concesionario)
);

CREATE TABLE vehiculos (
    id_vehiculo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano_matriculacion INT NOT NULL,
    numero_plazas INT NOT NULL,
    autonomia_km INT NOT NULL,
    color VARCHAR(50),
    imagen VARCHAR(255),
    estado ENUM('disponible','reservado','mantenimiento') NOT NULL DEFAULT 'disponible',
    id_concesionario INT UNSIGNED NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_concesionario) REFERENCES concesionarios(id_concesionario)
);

CREATE TABLE clientes (
    id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
    id_reserva INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_cliente INT UNSIGNED NULL,
    id_vehiculo INT UNSIGNED NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NULL,
    estado ENUM('activa','finalizada','cancelada') NOT NULL DEFAULT 'activa',
    kilometros_recorridos INT NULL,
    incidencias_reportadas TEXT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);


