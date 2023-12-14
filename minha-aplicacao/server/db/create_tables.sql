CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  coach VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  age INTEGER,
  position VARCHAR(50),
  CONSTRAINT fk_team
    FOREIGN KEY(team_id)
    REFERENCES teams(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  team1_id INTEGER REFERENCES teams(id),
  team2_id INTEGER REFERENCES teams(id),
  date TIMESTAMP,
  result VARCHAR(50),
  CONSTRAINT fk_team1
    FOREIGN KEY(team1_id)
    REFERENCES teams(id),
  CONSTRAINT fk_team2
    FOREIGN KEY(team2_id)
    REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  pub_date TIMESTAMP,
  author VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS broadcasts (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  url VARCHAR(255),
  platform VARCHAR(50),
  CONSTRAINT fk_match
    FOREIGN KEY(match_id)
    REFERENCES matches(id)
);