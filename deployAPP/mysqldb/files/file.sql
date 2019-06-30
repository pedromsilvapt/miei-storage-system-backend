UPDATE mysql.user SET HOST='%' WHERE User='root' AND Host='::1';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON storagesystem.* TO 'root'@'%' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
