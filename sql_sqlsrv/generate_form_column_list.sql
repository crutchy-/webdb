SELECT * FROM INFORMATION_SCHEMA.COLUMNS
WHERE
UPPER(TABLE_NAME)=:table
AND
UPPER(TABLE_SCHEMA)=:database;