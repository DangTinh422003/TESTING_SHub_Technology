CREATE TABLE stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15),
  INDEX idx_name (name)
);
CREATE TABLE goods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  INDEX idx_name (name)
);
CREATE TABLE pumps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id INT NOT NULL,
  good_id INT NOT NULL,
  pump_number VARCHAR(20) NOT NULL,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  FOREIGN KEY (good_id) REFERENCES goods(id) ON DELETE CASCADE,
  INDEX idx_station_good (station_id, good_id)
);
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  station_id INT NOT NULL,
  pump_id INT NOT NULL,
  good_id INT NOT NULL,
  transaction_time DATETIME NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  FOREIGN KEY (pump_id) REFERENCES pumps(id) ON DELETE CASCADE,
  FOREIGN KEY (good_id) REFERENCES goods(id) ON DELETE CASCADE,
  INDEX idx_transaction_time (transaction_time)
);