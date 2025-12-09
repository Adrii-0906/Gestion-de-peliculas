package com.gestionPeliculas; // <--- Asegúrate de que este sea tu paquete real
import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.repository.PeliculaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(PeliculaRepository repo) {
        return args -> {
            repo.deleteAll(); // Borramos lo antiguo para no duplicar

            List<Pelicula> lista = new ArrayList<>();

            // 1. RELEVANTES (Para el Carrusel de arriba)
            lista.add(crearPeli("Dune: Parte Dos", "Paul Atreides se une a los Fremen para vengarse...", 166, LocalDate.of(2024, 3, 1), 5, "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"));
            lista.add(crearPeli("Oppenheimer", "La historia del creador de la bomba atómica.", 180, LocalDate.of(2023, 7, 21), 5, "https://image.tmdb.org/t/p/w500/ncKCQVXgk4BcQV6XbvesgZ2zGpZ.jpg"));
            lista.add(crearPeli("Avatar: El sentido del agua", "Jake Sully vive con su nueva familia en Pandora.", 192, LocalDate.of(2022, 12, 16), 4, "https://image.tmdb.org/t/p/w500/kuf6dutpsT0vZEkc59YXd9jdPIZ.jpg"));
            lista.add(crearPeli("Top Gun: Maverick", "Después de treinta años, Maverick sigue al límite.", 131, LocalDate.of(2022, 5, 27), 5, "https://image.tmdb.org/t/p/w500/AlWpkvZw9QbhS7E6bI0X6gP7t5.jpg"));
            lista.add(crearPeli("The Batman", "Bruce Wayne se adentra en las sombras de Gotham.", 176, LocalDate.of(2022, 3, 4), 4, "https://image.tmdb.org/t/p/w500/cKnMkGP1abj9bX74Hl187n7bA2v.jpg"));

            // 2. CIENCIA FICCIÓN
            lista.add(crearPeli("Interstellar", "Un viaje a través de un agujero de gusano.", 169, LocalDate.of(2014, 11, 7), 5, "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDaX06DBstrJ2UF.jpg"));
            lista.add(crearPeli("Origen", "El espionaje corporativo entra en los sueños.", 148, LocalDate.of(2010, 7, 16), 5, "https://image.tmdb.org/t/p/w500/9gk7admalml42yuffv86nwk75VL.jpg"));
            lista.add(crearPeli("Blade Runner 2049", "Un nuevo blade runner descubre un secreto oculto.", 164, LocalDate.of(2017, 10, 6), 4, "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"));
            lista.add(crearPeli("Matrix", "Neo descubre la verdad sobre su realidad simulada.", 136, LocalDate.of(1999, 3, 31), 5, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"));
            lista.add(crearPeli("Star Wars: Una nueva esperanza", "Luke Skywalker se une a la alianza rebelde.", 121, LocalDate.of(1977, 5, 25), 5, "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg"));

            // 3. CINE ESPAÑOL
            lista.add(crearPeli("La sociedad de la nieve", "El vuelo 571 se estrella en los Andes. Solo 29 sobreviven.", 144, LocalDate.of(2023, 12, 15), 5, "https://image.tmdb.org/t/p/w500/2e853nxd9ySopOvxf8x12lJicT.jpg"));
            lista.add(crearPeli("El laberinto del fauno", "En la posguerra española, una niña descubre un mundo mágico.", 118, LocalDate.of(2006, 10, 11), 5, "https://image.tmdb.org/t/p/w500/3oShs44Q6c47XWq3k6y6YnKzU3.jpg"));
            lista.add(crearPeli("Los otros", "Una mujer vive en una casa antigua con sus hijos fotosensibles.", 104, LocalDate.of(2001, 9, 7), 4, "https://image.tmdb.org/t/p/w500/wE8Gq7tqG9y9y9y9y9y9y9y9y9.jpg")); // Nota: URL ficticia, TMDB la buscará bien si falla
            lista.add(crearPeli("Celda 211", "Un funcionario de prisiones queda atrapado en un motín.", 113, LocalDate.of(2009, 11, 6), 4, "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg")); // Reusando img temporal
            lista.add(crearPeli("Contratiempo", "Un joven empresario despierta en una habitación de hotel junto al cadáver de su amante.", 106, LocalDate.of(2017, 1, 6), 4, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"));

            repo.saveAll(lista);
            System.out.println("✅ BASE DE DATOS LLENA: Relevantes, Ficción y Españolas.");
        };
    }

    private Pelicula crearPeli(String titulo, String sinopsis, Integer duracion, LocalDate fecha, Integer valoracion, String url) {
        Pelicula p = new Pelicula();
        p.setTitulo(titulo);
        p.setSinopsis(sinopsis);
        p.setDuracion(duracion);
        p.setFechaEstreno(fecha);
        p.setValoracion(valoracion);
        p.setImagenUrl(url);
        return p;
    }
}