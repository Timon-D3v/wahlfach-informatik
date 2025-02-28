SELECT * from countries ORDER BY gdp DESC LIMIT 1;


SELECT SUM(population) AS "Gesamtbevölkerung", AVG(area) as "Durchschnittsfläche" FROM countries;


SELECT subregion, SUM(gdp) AS "Gesamt BIP" FROM countries GROUP BY subregion;


SELECT continent, COUNT(*) AS "Anzahl Länder" FROM countries GROUP BY continent;


SELECT COUNT(DISTINCT continent) AS "Anzahl Kontinente", COUNT(DISTINCT subregion) AS "Anzahl Unterregionen" FROM countries;


SELECT subregion, AVG(gdp) AS "Durchschnittlicher BIP" FROM countries GROUP BY subregion HAVING COUNT(*) > 15;


SELECT `year`, COUNT(DISTINCT name) from babyname GROUP BY `year`;


SELECT sex, COUNT(DISTINCT name) from babyname WHERE `year` = 2000 GROUP BY sex;