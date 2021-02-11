CREATE DATABASE db_nodejs_rest_sample;

USE db_nodejs_rest_sample;

CREATE TABLE tbl_pessoas (
	id_pessoa INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
	nome VARCHAR(255) NOT NULL,
    idade VARCHAR(3) NOT NULL,
    genero ENUM('M','F','Outros') NOT NULL,
    nacionalidade VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_pessoa)
);

DESCRIBE tbl_pessoas;

SELECT * FROM tbl_pessoas;

# DROP TABLE tbl_pessoas;

