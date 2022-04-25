INSERT INTO users(login, password, age, isDeleted) VALUES 
('Mark', 'qwe', 27, false),
('Tony', '123', 20, false),
('Mary', '123', 40, false),
('Kate', '123', 20, false),
('Andrew', '123', 20, false),
('Zara', '123', 20, false),
('Yura', '123', 20, false),
('Polly', '123', 20, false);

INSERT INTO groups(name, permissions) VALUES
('Group1', ARRAY ['READ']),
('Group2', ARRAY ['READ', 'WRITE']);