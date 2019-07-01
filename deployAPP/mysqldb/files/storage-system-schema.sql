-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: storagesystem
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(95) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cities` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` longtext NOT NULL,
  `Country` longtext NOT NULL,
  `CoordinatesLatitude` double NOT NULL,
  `CoordinatesLongitude` double NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=102908598 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `consumedproductitems`
--

DROP TABLE IF EXISTS `consumedproductitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `consumedproductitems` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ProductId` int(11) NOT NULL,
  `OwnerId` int(11) NOT NULL,
  `Shared` bit(1) NOT NULL,
  `ExpiryDate` datetime(6) NOT NULL,
  `AddedDate` datetime(6) NOT NULL,
  `ConsumedDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ConsumedProductItems_OwnerId` (`OwnerId`),
  KEY `IX_ConsumedProductItems_ProductId` (`ProductId`),
  CONSTRAINT `FK_ConsumedProductItems_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `products` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ConsumedProductItems_Users_OwnerId` FOREIGN KEY (`OwnerId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6662 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productitems`
--

DROP TABLE IF EXISTS `productitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `productitems` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ProductId` int(11) NOT NULL,
  `OwnerId` int(11) NOT NULL,
  `Shared` bit(1) NOT NULL,
  `ExpiryDate` datetime(6) NOT NULL,
  `AddedDate` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00.000000',
  PRIMARY KEY (`Id`),
  KEY `IX_ProductItems_OwnerId` (`OwnerId`),
  KEY `IX_ProductItems_ProductId` (`ProductId`),
  CONSTRAINT `FK_ProductItems_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `products` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ProductItems_Users_OwnerId` FOREIGN KEY (`OwnerId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7470 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) NOT NULL,
  `Barcode` varchar(200) DEFAULT NULL,
  `StorageId` int(11) NOT NULL,
  `MaxTemperature` double DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Products_StorageId` (`StorageId`),
  CONSTRAINT `FK_Products_Storages_StorageId` FOREIGN KEY (`StorageId`) REFERENCES `storages` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shoppinglistitems`
--

DROP TABLE IF EXISTS `shoppinglistitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shoppinglistitems` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `StorageId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `OwnerId` int(11) NOT NULL,
  `Count` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ShoppingListItems_ProductId` (`ProductId`),
  KEY `IX_ShoppingListItems_StorageId` (`StorageId`),
  KEY `IX_ShoppingListItems_UserId` (`UserId`),
  CONSTRAINT `FK_ShoppingListItems_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `products` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ShoppingListItems_Storages_StorageId` FOREIGN KEY (`StorageId`) REFERENCES `storages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ShoppingListItems_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `storageinvitations`
--

DROP TABLE IF EXISTS `storageinvitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `storageinvitations` (
  `StorageId` int(11) NOT NULL,
  `UserEmail` varchar(254) NOT NULL,
  `AuthorId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`StorageId`,`UserEmail`),
  KEY `IX_StorageInvitations_AuthorId` (`AuthorId`),
  CONSTRAINT `FK_StorageInvitations_Storages_StorageId` FOREIGN KEY (`StorageId`) REFERENCES `storages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_StorageInvitations_Users_AuthorId` FOREIGN KEY (`AuthorId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `storages`
--

DROP TABLE IF EXISTS `storages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `storages` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `OwnerId` int(11) NOT NULL,
  `Shared` bit(1) NOT NULL DEFAULT b'0',
  `CityId` int(11) DEFAULT NULL,
  `LastWeatherForecast` datetime(6) DEFAULT NULL,
  `LastWeatherForecastTemperature` float DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Storages_OwnerId` (`OwnerId`),
  KEY `IX_Storages_CityId` (`CityId`),
  CONSTRAINT `FK_Storages_Cities_CityId` FOREIGN KEY (`CityId`) REFERENCES `cities` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Storages_Users_OwnerId` FOREIGN KEY (`OwnerId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `storageusers`
--

DROP TABLE IF EXISTS `storageusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `storageusers` (
  `UserId` int(11) NOT NULL,
  `StorageId` int(11) NOT NULL,
  PRIMARY KEY (`StorageId`,`UserId`),
  KEY `IX_StorageUsers_UserId` (`UserId`),
  CONSTRAINT `FK_StorageUsers_Storages_StorageId` FOREIGN KEY (`StorageId`) REFERENCES `storages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_StorageUsers_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userproductpreferences`
--

DROP TABLE IF EXISTS `userproductpreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userproductpreferences` (
  `UserId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `MinCount` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`ProductId`),
  KEY `IX_UserProductPreferences_ProductId` (`ProductId`),
  CONSTRAINT `FK_UserProductPreferences_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `products` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_UserProductPreferences_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) NOT NULL,
  `Email` varchar(254) NOT NULL,
  `Password` varchar(264) NOT NULL,
  `Salt` varchar(8) NOT NULL,
  `VerificationCode` longtext,
  `Verified` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `AK_Users_Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-28 17:09:09
