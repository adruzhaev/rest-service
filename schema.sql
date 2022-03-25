CREATE TABLE Users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    deletedAt DATE DEFAULT NULL
);