-- V2 - create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(512) NOT NULL,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (token),
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
