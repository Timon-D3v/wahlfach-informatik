-- Create the table students 
CREATE TABLE IF NOT EXISTS students (
  	first_name VARCHAR(512),
  	last_name VARCHAR(512),
  	year_of_entry INT,
  	date_of_birth DATE,
  	provisional BOOLEAN
);


-- Insert some students  
INSERT INTO students (first_name, last_name, year_of_entry, date_of_birth, provisional) VALUES ('Timon', 'Fiedler', 2021, '2006-12-22', FALSE);
INSERT INTO students (first_name, last_name, year_of_entry, date_of_birth, provisional) VALUES ('Daniel', 'Mietkiewicz', 2021, '2007-01-24', TRUE);
INSERT INTO students (first_name, last_name, year_of_entry, date_of_birth, provisional) VALUES ('Felix', 'Bizard', 2021, '2007-03-09', FALSE);


-- Display the table
SELECT * from students;