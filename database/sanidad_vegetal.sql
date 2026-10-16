CREATE DATABASE IF NOT EXISTS `sanidad_vegetal`;
USE `sanidad_vegetal`;

DROP TABLE IF EXISTS `brotes`;
CREATE TABLE `brotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plantaId` int NOT NULL,
  `enfermedadId` int NOT NULL,
  `fecha` date NOT NULL,
  `region` varchar(100) NOT NULL,
  `hectareasAfectadas` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `cultivos`;
CREATE TABLE `cultivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plantaId` int NOT NULL,
  `loteFinca` varchar(100) NOT NULL,
  `region` varchar(100) NOT NULL,
  `fechaSiembra` date NOT NULL,
  `codigoGeneticoSemilla` text NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `enfermedades`;
CREATE TABLE `enfermedades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `sintomas` text NOT NULL,
  `epocaRiesgo` varchar(20) NOT NULL,
  `patogenoId` int NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `patogenos`;
CREATE TABLE `patogenos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `nombreCientifico` varchar(150) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `formaTransmision` varchar(30) NOT NULL,
  `secuenciaGenetica` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombreCientifico` (`nombreCientifico`)
);

DROP TABLE IF EXISTS `plantas`;
CREATE TABLE `plantas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreComun` varchar(100) NOT NULL,
  `nombreCientifico` varchar(150) NOT NULL,
  `familiaBotanica` varchar(100) NOT NULL,
  `tipoCultivo` varchar(20) NOT NULL,
  `secuenciaGenetica` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombreCientifico` (`nombreCientifico`)
);

DROP TABLE IF EXISTS `susceptibilidades`;
CREATE TABLE `susceptibilidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plantaId` int NOT NULL,
  `enfermedadId` int NOT NULL,
  `nivel` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plantaId` (`plantaId`,`enfermedadId`)
);

DROP TABLE IF EXISTS `tratamientos`;
CREATE TABLE `tratamientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcionAplicacion` text NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `enfermedadId` int NOT NULL,
  PRIMARY KEY (`id`)
);
