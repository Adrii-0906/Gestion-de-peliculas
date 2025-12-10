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
            repo.deleteAll(); // Borramos para empezar limpio

            List<Pelicula> lista = new ArrayList<>();

            // --- HERO / NOVEDADES (Blockbusters recientes) ---
            lista.add(crearPeli("Dune: Parte Dos", "Paul Atreides lidera la rebelión contra los Harkonnen.", 166, LocalDate.of(2024, 3, 1), 5, "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"));
            lista.add(crearPeli("Oppenheimer", "El dilema moral del padre de la bomba atómica.", 180, LocalDate.of(2023, 7, 21), 5, "https://image.tmdb.org/t/p/w500/ncKCQVXgk4BcQV6XbvesgZ2zGpZ.jpg"));
            lista.add(crearPeli("Avatar: El sentido del agua", "El regreso a Pandora bajo el agua.", 192, LocalDate.of(2022, 12, 16), 4, "https://image.tmdb.org/t/p/w500/kuf6dutpsT0vZEkc59YXd9jdPIZ.jpg"));
            lista.add(crearPeli("The Batman", "Un Batman oscuro investiga la corrupción de Gotham.", 176, LocalDate.of(2022, 3, 4), 5, "https://image.tmdb.org/t/p/w500/cKnMkGP1abj9bX74Hl187n7bA2v.jpg"));
            lista.add(crearPeli("Top Gun: Maverick", "Maverick vuelve para entrenar a una nueva generación.", 131, LocalDate.of(2022, 5, 27), 5, "https://image.tmdb.org/t/p/w500/AlWpkvZw9QbhS7E6bI0X6gP7t5.jpg"));

            // --- ANIMACIÓN (Disney, Pixar, Ghibli, Sony) ---
            lista.add(crearPeli("Spider-Man: Cruzando el Multiverso", "Miles Morales viaja por el multiverso arácnido.", 140, LocalDate.of(2023, 6, 2), 5, "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"));
            lista.add(crearPeli("El viaje de Chihiro", "Una niña queda atrapada en un mundo de espíritus.", 125, LocalDate.of(2001, 7, 20), 5, "https://image.tmdb.org/t/p/w500/bb54J1y9jY9Mv2n9Z5X9.jpg")); // Nota: URL simulada, TMDB la corregirá si falla o usar placeholder
            lista.add(crearPeli("Coco", "Un niño viaja a la tierra de los muertos para encontrar a su bisabuelo.", 105, LocalDate.of(2017, 10, 27), 5, "https://image.tmdb.org/t/p/w500/gGeOxiIwwa6ZgD1p8d8I6.jpg")); // URL simulada
            lista.add(crearPeli("Toy Story", "Los juguetes cobran vida cuando nadie mira.", 81, LocalDate.of(1995, 11, 22), 5, "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg"));
            lista.add(crearPeli("El Rey León", "Un cachorro de león huye tras la muerte de su padre.", 88, LocalDate.of(1994, 6, 24), 5, "https://image.tmdb.org/t/p/w500/b0MxUcaDIgHanw75ck7ulK7F6.jpg")); // URL simulada

            // --- TERROR / THRILLER ---
            lista.add(crearPeli("El Resplandor", "Una familia cuida un hotel aislado en invierno.", 146, LocalDate.of(1980, 5, 23), 5, "https://image.tmdb.org/t/p/w500/b4gY5r.jpg")); // URL simulada
            lista.add(crearPeli("Alien: El octavo pasajero", "Una criatura acecha en una nave espacial.", 117, LocalDate.of(1979, 5, 25), 5, "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg"));
            lista.add(crearPeli("Psicosis", "Una secretaria roba dinero y huye a un motel.", 109, LocalDate.of(1960, 6, 16), 5, "https://image.tmdb.org/t/p/w500/81d8oyEFxHjZmsu.jpg")); // URL simulada
            lista.add(crearPeli("It", "Un grupo de niños es aterrorizado por un payaso.", 135, LocalDate.of(2017, 9, 8), 4, "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTJhEhx1o.jpg"));
            lista.add(crearPeli("Déjame salir", "Un joven visita a la familia de su novia y descubre algo aterrador.", 104, LocalDate.of(2017, 2, 24), 5, "https://image.tmdb.org/t/p/w500/1SjZk.jpg")); // URL simulada

            // --- ACCIÓN / ÉPICAS ---
            lista.add(crearPeli("Gladiator", "Un general romano busca venganza tras ser traicionado.", 155, LocalDate.of(2000, 5, 5), 5, "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwviv.jpg"));
            lista.add(crearPeli("El Señor de los Anillos: El retorno del Rey", "La batalla final por la Tierra Media.", 201, LocalDate.of(2003, 12, 17), 5, "https://image.tmdb.org/t/p/w500/mWU785YFv3v3z8z98096.jpg"));
            lista.add(crearPeli("Matrix", "Un hacker descubre la realidad simulada.", 136, LocalDate.of(1999, 3, 31), 5, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"));
            lista.add(crearPeli("Vengadores: Endgame", "Los héroes intentan deshacer el chasquido de Thanos.", 181, LocalDate.of(2019, 4, 26), 5, "https://image.tmdb.org/t/p/w500/br64C9y9Kth08I5a676qjW08d4.jpg"));
            lista.add(crearPeli("Mad Max: Furia en la carretera", "Persecución frenética en un desierto post-apocalíptico.", 120, LocalDate.of(2015, 5, 15), 5, "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg"));

            // --- DRAMA / CLÁSICOS ---
            lista.add(crearPeli("El Padrino", "El auge de una familia mafiosa.", 175, LocalDate.of(1972, 3, 24), 5, "https://image.tmdb.org/t/p/w500/jF5q7a6aR2zX96a3205756.jpg"));
            lista.add(crearPeli("Pulp Fiction", "Historias cruzadas de criminales.", 154, LocalDate.of(1994, 10, 14), 5, "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"));
            lista.add(crearPeli("Forrest Gump", "La vida de un hombre extraordinario.", 142, LocalDate.of(1994, 7, 6), 5, "https://image.tmdb.org/t/p/w500/az8k0v8975246974238.jpg"));
            lista.add(crearPeli("Parásitos", "Una familia pobre se infiltra en una casa rica.", 132, LocalDate.of(2019, 5, 30), 5, "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"));
            lista.add(crearPeli("Titanic", "Un romance en el trágico viaje inaugural.", 195, LocalDate.of(1997, 12, 19), 5, "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"));

            repo.saveAll(lista);
            System.out.println("✅ MEGA CATÁLOGO CARGADO (25+ Películas)");
        };
    }

    private Pelicula crearPeli(String titulo, String sinopsis, Integer duracion, LocalDate fecha, Integer valoracion, String url) {
        Pelicula p = new Pelicula();
        p.setTitulo(titulo);
        p.setSinopsis(sinopsis);
        p.setDuracion(duracion);
        p.setFechaEstreno(fecha);
        p.setValoracion(valoracion);
        p.setImagenUrl(url); // Aunque TMDB sobrescribirá la foto en el front, la guardamos por si acaso
        return p;
    }
}