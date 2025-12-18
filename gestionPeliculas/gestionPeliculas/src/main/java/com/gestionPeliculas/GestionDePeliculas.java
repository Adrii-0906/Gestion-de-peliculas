package com.gestionPeliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.gestionPeliculas.repository")
@EntityScan(basePackages = "com.gestionPeliculas.domain")
public class GestionDePeliculas {

    public static void main(String[] args) {
        SpringApplication.run(GestionDePeliculas.class, args);
    }

}
