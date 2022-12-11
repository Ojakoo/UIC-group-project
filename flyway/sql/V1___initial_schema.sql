CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  amount INT NOT NULL,
  location TEXT NOT NULL,
  growth INT NOT NULL,
  time DATE DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);