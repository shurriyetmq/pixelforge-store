-- MySQL dump 10.13  Distrib 9.6.0, for macos14.8 (x86_64)
--
-- Host: localhost    Database: pixelforge_store
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '0a99a890-19b7-11f1-8076-ccf87561857a:1-74';

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Games',
  `further_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nebula Quest',59.99,'Open-world sci-fi adventure across distant galaxies.','/images/nebula-quest.png','Games','Embark on a breathtaking intergalactic journey with Nebula Quest, featuring rich worlds, deep lore, and exciting side quests.'),(2,'BeastBuds Max',89.99,'Newest wireless earbuds with noise cancellation.','/images/beastbuds-max.png','Accessories','BeastBuds Max delivers crystal-clear audio and active noise cancellation for all your music and calls, with a sleek ergonomic design.'),(3,'PixelStation X',499.99,'Next-generation gaming console with 8K support.','/images/pixelstation-x.png','Consoles','PixelStation X brings 8K gaming and lightning-fast load times, packed with exclusive titles for the ultimate next-gen experience.'),(4,'GameSphere Pro',449.99,'High performance console built for competitive gaming.','/images/gamesphere-pro.png','Consoles','GameSphere Pro is designed for competitive gaming with high FPS performance, advanced cooling, and a professional-grade controller ecosystem.'),(5,'Phantom Controller',69.99,'Wireless controller with ultra-low latency.','/images/phantom-controller.png','Accessories','Phantom Controller offers responsive buttons and ultra-low latency, giving gamers precise control over every move.'),(6,'XtremeSound Gaming Headset',89.99,'Immersive surround sound for competitive play.','/images/xtremesound-headset.png','Accessories','XtremeSound Gaming Headset provides immersive surround sound and crystal-clear communication for serious gamers.'),(7,'Galaxy Racers',39.99,'High-speed racing across futuristic worlds.','/images/galaxy-racers.png','Games','Galaxy Racers takes you through futuristic racetracks at high speeds with stunning visuals and challenging opponents.'),(8,'RetroCube Mini',129.99,'Classic console packed with retro games.','/images/retrocube.png','Consoles','RetroCube Mini packs hundreds of classic games in a compact design, perfect for nostalgia and on-the-go gaming.'),(9,'Hyper RGB Gaming Keyboard',79.99,'Mechanical keyboard with customizable RGB lighting.','/images/keyboard.png','Accessories','Hyper RGB Gaming Keyboard features mechanical keys and customizable RGB lighting, perfect for enhancing your gaming setup.');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 19:24:23
