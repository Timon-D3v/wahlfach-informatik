SELECT * FROM countries ORDER BY gdp DESC LIMIT 1;


SELECT SUM(population) AS "Gesamtbevölkerung", AVG(area) AS "Durchschnittsfläche" FROM countries;


SELECT subregion, SUM(gdp) AS "Gesamt BIP" FROM countries GROUP BY subregion;


SELECT continent, COUNT(*) AS "Anzahl Länder" FROM countries GROUP BY continent;


SELECT COUNT(DISTINCT continent) AS "Anzahl Kontinente", COUNT(DISTINCT subregion) AS "Anzahl Unterregionen" FROM countries;


SELECT subregion, AVG(gdp) AS "Durchschnittlicher BIP" FROM countries GROUP BY subregion HAVING COUNT(*) > 15;


SELECT `year`, COUNT(DISTINCT name) FROM babyname GROUP BY `year`;


SELECT sex, COUNT(DISTINCT name) FROM babyname WHERE `year` = 2000 GROUP BY sex;

SELECT `year`, COUNT(DISTINCT name) FROM babyname GROUP BY year ORDER BY COUNT(DISTINCT name) DESC LIMIT 1;

SELECT year, name, birth_count FROM babyname WHERE birth_count > 20 ORDER BY birth_count DESC;