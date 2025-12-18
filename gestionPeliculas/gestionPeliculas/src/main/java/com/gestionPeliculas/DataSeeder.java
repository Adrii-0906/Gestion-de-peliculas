package com.gestionPeliculas;

import com.gestionPeliculas.domain.*;
import com.gestionPeliculas.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(PeliculaRepository peliculaRepo,
                        DirectorRepository directorRepo,
                        ActorRepository actorRepo,
                        CategoriaRepository categoriaRepo,
                        IdiomaRepository idiomaRepo,
                        PlataformaRepository plataformaRepo,
                        UsuarioRepository usuarioRepo,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // Crear usuario admin si no existe
                        if (usuarioRepo.findByEmail("admin@cine.com").isEmpty()) {
                                Usuario admin = new Usuario();
                                admin.setUsername("Admin");
                                admin.setEmail("admin@cine.com");
                                admin.setPassword(passwordEncoder.encode("admin123"));
                                admin.setRol(Rol.ADMINISTRADOR);
                                admin.setAvatar("https://ui-avatars.com/api/?name=Admin&background=random");
                                usuarioRepo.save(admin);
                                System.out.println(">>> Usuario ADMIN creado: admin@cine.com / admin123");
                        }

                        // Corregir usuarios sin rol
                        List<Usuario> usuariosSinRol = usuarioRepo.findAll().stream()
                                        .filter(u -> u.getRol() == null)
                                        .toList();

                        if (!usuariosSinRol.isEmpty()) {
                                usuariosSinRol.forEach(u -> {
                                        u.setRol(Rol.USUARIO);
                                });
                                usuarioRepo.saveAll(usuariosSinRol);
                        }

                        // Asignar edadMinima a películas que no lo tengan
                        List<Pelicula> peliculasSinEdad = peliculaRepo.findAll().stream()
                                        .filter(p -> p.getEdadMinima() == null)
                                        .toList();

                        if (!peliculasSinEdad.isEmpty()) {
                                // Asignar edad 12 por defecto a todas (evitar lazy loading de categorías)
                                peliculasSinEdad.forEach(p -> p.setEdadMinima(12));
                                peliculaRepo.saveAll(peliculasSinEdad);
                                System.out.println(
                                                ">>> Asignada edadMinima=12 a " + peliculasSinEdad.size()
                                                                + " películas");
                        }

                        if (peliculaRepo.count() > 0) {
                                System.out.println(">>> Datos ya existentes. NO se carga DataSeeder.");
                                return;
                        }

                        System.out.println(">>> CARGANDO CATÁLOGO CON CATEGORÍAS...");

                        Map<String, Director> directores = new HashMap<>();
                        Map<String, Actor> actores = new HashMap<>();
                        Map<String, Categoria> categorias = new HashMap<>(); // Nuevo mapa para categorías

                        // Helper para crear directores
                        java.util.function.Function<String, Director> getDirector = nombre -> {
                                return directores.computeIfAbsent(nombre, n -> {
                                        Director d = new Director();
                                        d.setNombre(n);
                                        return directorRepo.save(d);
                                });
                        };

                        // Helper para crear actores
                        java.util.function.Function<String, Actor> getActor = nombre -> {
                                return actores.computeIfAbsent(nombre, n -> {
                                        Actor a = new Actor();
                                        a.setNombre(n);
                                        return actorRepo.save(a);
                                });
                        };

                        // Helper para crear categorías
                        java.util.function.Function<String, Categoria> getCategoria = nombre -> {
                                return categorias.computeIfAbsent(nombre, n -> {
                                        Categoria c = new Categoria();
                                        c.setNombre(n);
                                        return categoriaRepo.save(c);
                                });
                        };

                        // Pre-cargar categorías comunes
                        Categoria accion = getCategoria.apply("Acción");
                        Categoria aventura = getCategoria.apply("Aventura");
                        Categoria scifi = getCategoria.apply("Ciencia Ficción");
                        Categoria drama = getCategoria.apply("Drama");
                        Categoria animacion = getCategoria.apply("Animación");
                        Categoria familia = getCategoria.apply("Familia");
                        Categoria comedia = getCategoria.apply("Comedia");
                        Categoria romance = getCategoria.apply("Romance");
                        Categoria terror = getCategoria.apply("Terror");
                        Categoria thriller = getCategoria.apply("Thriller");
                        Categoria fantasia = getCategoria.apply("Fantasía");
                        Categoria crimen = getCategoria.apply("Crimen");

                        List<Pelicula> peliculas = new ArrayList<>();

                        // 1-10: Películas de acción modernas
                        peliculas.add(crear("Dune: Parte Dos",
                                        "Paul Atreides se une a los Fremen en una guerra contra los Harkonnen.", 166,
                                        LocalDate.of(2024, 3, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Timothée Chalamet"), getActor.apply("Zendaya"),
                                                        getActor.apply("Rebecca Ferguson")),
                                        List.of(scifi, aventura, accion)));

                        peliculas.add(crear("Oppenheimer",
                                        "La historia del físico J. Robert Oppenheimer.", 180,
                                        LocalDate.of(2023, 7, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Cillian Murphy"), getActor.apply("Emily Blunt"),
                                                        getActor.apply("Robert Downey Jr.")),
                                        List.of(drama, thriller))); // Histórica no añadida para simplificar, usaremos
                                                                    // Drama

                        peliculas.add(crear("Top Gun: Maverick",
                                        "Pete Mitchell entrena a una nueva generación de pilotos.", 130,
                                        LocalDate.of(2022, 5, 27), 5,
                                        "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                                        getDirector.apply("Joseph Kosinski"),
                                        List.of(getActor.apply("Tom Cruise"), getActor.apply("Miles Teller")),
                                        List.of(accion, drama)));

                        peliculas.add(crear("John Wick 4", "John Wick descubre un camino para derrotar a la Alta Mesa.",
                                        169, LocalDate.of(2023, 3, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
                                        getDirector.apply("Chad Stahelski"),
                                        List.of(getActor.apply("Keanu Reeves")),
                                        List.of(accion, thriller, crimen)));

                        peliculas.add(crear("Avatar: El sentido del agua",
                                        "Jake Sully y su familia enfrentan una nueva amenaza.", 192,
                                        LocalDate.of(2022, 12, 16), 4,
                                        "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Sam Worthington"), getActor.apply("Zoe Saldaña")),
                                        List.of(scifi, aventura, accion)));

                        peliculas.add(crear("Mad Max: Furia en la carretera",
                                        "En un futuro postapocalíptico, Max ayuda a Furiosa.", 120,
                                        LocalDate.of(2015, 5, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
                                        getDirector.apply("George Miller"),
                                        List.of(getActor.apply("Tom Hardy"), getActor.apply("Charlize Theron")),
                                        List.of(accion, aventura, scifi)));

                        peliculas.add(crear("Gladiator",
                                        "Un general romano busca venganza.", 155,
                                        LocalDate.of(2000, 5, 5), 5,
                                        "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
                                        getDirector.apply("Ridley Scott"),
                                        List.of(getActor.apply("Russell Crowe"), getActor.apply("Joaquin Phoenix")),
                                        List.of(accion, drama, aventura)));

                        peliculas.add(crear("Matrix", "Un hacker descubre la verdadera naturaleza de su realidad.", 136,
                                        LocalDate.of(1999, 3, 31), 5,
                                        "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                                        getDirector.apply("Lana Wachowski"),
                                        List.of(getActor.apply("Keanu Reeves"), getActor.apply("Laurence Fishburne")),
                                        List.of(scifi, accion)));

                        peliculas.add(crear("Origen", "Un ladrón que roba secretos a través de los sueños.", 148,
                                        LocalDate.of(2010, 7, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Leonardo DiCaprio")),
                                        List.of(scifi, accion, aventura)));

                        peliculas.add(crear("El caballero oscuro",
                                        "Batman enfrenta al Joker.", 152,
                                        LocalDate.of(2008, 7, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Christian Bale"), getActor.apply("Heath Ledger")),
                                        List.of(accion, crimen, drama)));

                        // 11-20: Clásicos
                        peliculas.add(crear("El Padrino", "La saga de la familia mafiosa Corleone.", 175,
                                        LocalDate.of(1972, 3, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                                        getDirector.apply("Francis Ford Coppola"),
                                        List.of(getActor.apply("Marlon Brando"), getActor.apply("Al Pacino")),
                                        List.of(drama, crimen)));

                        peliculas.add(crear("Pulp Fiction", "Historias entrelazadas en Los Ángeles.", 154,
                                        LocalDate.of(1994, 10, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("John Travolta"), getActor.apply("Uma Thurman"),
                                                        getActor.apply("Samuel L. Jackson")),
                                        List.of(thriller, crimen)));

                        peliculas.add(crear("Forrest Gump", "La vida extraordinaria de un hombre simple.", 142,
                                        LocalDate.of(1994, 7, 6), 5,
                                        "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                                        getDirector.apply("Robert Zemeckis"),
                                        List.of(getActor.apply("Tom Hanks")),
                                        List.of(drama, comedia, romance)));

                        peliculas.add(crear("Cadena perpetua",
                                        "Dos prisioneros forjan una amistad.", 142,
                                        LocalDate.of(1994, 9, 23), 5,
                                        "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                                        getDirector.apply("Frank Darabont"),
                                        List.of(getActor.apply("Tim Robbins"), getActor.apply("Morgan Freeman")),
                                        List.of(drama, crimen)));

                        peliculas.add(crear("El club de la lucha",
                                        "Un hombre insomne forma un club clandestino.", 139,
                                        LocalDate.of(1999, 10, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Brad Pitt"), getActor.apply("Edward Norton")),
                                        List.of(drama)));

                        peliculas.add(crear("El silencio de los corderos",
                                        "Una agente del FBI busca ayuda de un caníbal.", 118,
                                        LocalDate.of(1991, 2, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
                                        getDirector.apply("Jonathan Demme"),
                                        List.of(getActor.apply("Jodie Foster"), getActor.apply("Anthony Hopkins")),
                                        List.of(crimen, drama, thriller)));

                        peliculas.add(crear("Psicosis", "Alojamiento en un motel siniestro.",
                                        109, LocalDate.of(1960, 6, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
                                        getDirector.apply("Alfred Hitchcock"),
                                        List.of(getActor.apply("Anthony Perkins")),
                                        List.of(terror, thriller)));

                        peliculas.add(crear("Ciudadano Kane", "La vida de un magnate.", 119,
                                        LocalDate.of(1941, 5, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
                                        getDirector.apply("Orson Welles"),
                                        List.of(getActor.apply("Orson Welles")),
                                        List.of(drama)));

                        peliculas.add(crear("Casablanca", "Amor y deber.",
                                        102, LocalDate.of(1942, 11, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
                                        getDirector.apply("Michael Curtiz"),
                                        List.of(getActor.apply("Humphrey Bogart"), getActor.apply("Ingrid Bergman")),
                                        List.of(drama, romance)));

                        peliculas.add(crear("Lo que el viento se llevó",
                                        "Amor durante la Guerra Civil.", 238,
                                        LocalDate.of(1939, 12, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/bv3ub7wQRNnpyXzBCMmEsDvOBT5.jpg",
                                        getDirector.apply("Victor Fleming"),
                                        List.of(getActor.apply("Vivien Leigh"), getActor.apply("Clark Gable")),
                                        List.of(drama, romance)));

                        // 21-30: Sci-Fi
                        peliculas.add(crear("Blade Runner 2049", "Un nuevo blade runner descubre un secreto.",
                                        164, LocalDate.of(2017, 10, 6), 5,
                                        "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Harrison Ford")),
                                        List.of(scifi, drama)));

                        peliculas.add(crear("Interstellar",
                                        "Viaje a través de un agujero de gusano.", 169,
                                        LocalDate.of(2014, 11, 7), 5,
                                        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Matthew McConaughey"), getActor.apply("Anne Hathaway")),
                                        List.of(aventura, drama, scifi)));

                        peliculas.add(crear("Arrival", "Comunicación con extraterrestres.", 116,
                                        LocalDate.of(2016, 11, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Amy Adams"), getActor.apply("Jeremy Renner")),
                                        List.of(drama, scifi, thriller)));

                        peliculas.add(crear("Ex Machina", "Test de Turing a una IA.", 108,
                                        LocalDate.of(2015, 1, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/btbRB7BrD887j5NrvjxceRDmaot.jpg",
                                        getDirector.apply("Alex Garland"),
                                        List.of(getActor.apply("Alicia Vikander"), getActor.apply("Oscar Isaac")),
                                        List.of(drama, scifi)));

                        peliculas.add(crear("Her", "Enamorado de un sistema operativo.", 126,
                                        LocalDate.of(2013, 12, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/yk4J4aewWYNiBhD49Ls5rTXEldC.jpg",
                                        getDirector.apply("Spike Jonze"), // Joaquin Phoenix ya existe
                                        List.of(getActor.apply("Joaquin Phoenix"),
                                                        getActor.apply("Scarlett Johansson")),
                                        List.of(romance, drama, scifi)));

                        peliculas.add(crear("Gravity", "Supervivencia en el espacio.", 91,
                                        LocalDate.of(2013, 10, 4), 5,
                                        "https://image.tmdb.org/t/p/w500/uPxtxhB2Fy9ihVqtBtNGHmknJqV.jpg",
                                        getDirector.apply("Alfonso Cuarón"),
                                        List.of(getActor.apply("Sandra Bullock"), getActor.apply("George Clooney")),
                                        List.of(scifi, thriller, drama)));

                        peliculas.add(crear("The Martian",
                                        "Varado en Marte.", 144,
                                        LocalDate.of(2015, 10, 2), 5,
                                        "https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
                                        getDirector.apply("Ridley Scott"),
                                        List.of(getActor.apply("Matt Damon"), getActor.apply("Jessica Chastain")),
                                        List.of(scifi, aventura, drama)));

                        peliculas.add(crear("District 9", "Alienígenas en un gueto.", 112,
                                        LocalDate.of(2009, 8, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/axFmCRNQsLxfHpPNprc5ybMb4To.jpg",
                                        getDirector.apply("Neill Blomkamp"),
                                        List.of(getActor.apply("Sharlto Copley")),
                                        List.of(scifi, accion, thriller)));

                        peliculas.add(crear("Edge of Tomorrow",
                                        "Revivir el mismo día de batalla.", 113,
                                        LocalDate.of(2014, 6, 6), 4,
                                        "https://image.tmdb.org/t/p/w500/xjw5trHV7Eng6EM9OoRlBNPfEME.jpg",
                                        getDirector.apply("Doug Liman"),
                                        List.of(getActor.apply("Tom Cruise"), getActor.apply("Emily Blunt")),
                                        List.of(accion, scifi)));

                        peliculas.add(crear("Terminator 2", "Un cyborg protege al futuro líder.", 137,
                                        LocalDate.of(1991, 7, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Arnold Schwarzenegger"),
                                                        getActor.apply("Linda Hamilton")),
                                        List.of(accion, thriller, scifi)));

                        // 31-40: Marvel/DC
                        peliculas.add(crear("Avengers: Endgame",
                                        "Revertir el chasquido.", 181,
                                        LocalDate.of(2019, 4, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                                        getDirector.apply("Anthony Russo"),
                                        List.of(getActor.apply("Robert Downey Jr."), getActor.apply("Chris Evans")),
                                        List.of(aventura, scifi, accion)));

                        peliculas.add(crear("Spider-Man: No Way Home",
                                        "Identidad revelada.", 148,
                                        LocalDate.of(2021, 12, 17), 5,
                                        "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                                        getDirector.apply("Jon Watts"),
                                        List.of(getActor.apply("Tom Holland"), getActor.apply("Zendaya")),
                                        List.of(accion, aventura, scifi)));

                        peliculas.add(crear("Black Panther", "Rey de Wakanda.", 134,
                                        LocalDate.of(2018, 2, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
                                        getDirector.apply("Ryan Coogler"),
                                        List.of(getActor.apply("Chadwick Boseman"),
                                                        getActor.apply("Michael B. Jordan")),
                                        List.of(accion, aventura, scifi)));

                        peliculas.add(crear("Guardianes de la Galaxia",
                                        "Inadaptados salvan la galaxia.", 121,
                                        LocalDate.of(2014, 8, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJhqpkWIBCvB.jpg",
                                        getDirector.apply("James Gunn"),
                                        List.of(getActor.apply("Chris Pratt"), getActor.apply("Zoe Saldaña")),
                                        List.of(accion, scifi, aventura)));

                        peliculas.add(crear("Wonder Woman", "Diana de Themyscira.", 141,
                                        LocalDate.of(2017, 6, 2), 4,
                                        "https://image.tmdb.org/t/p/w500/gfJGlDaHuWimTpvGLJhodgs9bS9.jpg",
                                        getDirector.apply("Patty Jenkins"),
                                        List.of(getActor.apply("Gal Gadot"), getActor.apply("Chris Pine")),
                                        List.of(accion, aventura, fantasia)));

                        peliculas.add(crear("Joker", "El origen del villano.", 122,
                                        LocalDate.of(2019, 10, 4), 5,
                                        "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Joaquin Phoenix"), getActor.apply("Robert De Niro")),
                                        List.of(crimen, thriller, drama)));

                        peliculas.add(crear("Logan", "Wolverine envejecido.", 137,
                                        LocalDate.of(2017, 3, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
                                        getDirector.apply("James Mangold"),
                                        List.of(getActor.apply("Hugh Jackman"), getActor.apply("Patrick Stewart")),
                                        List.of(accion, drama, scifi)));

                        peliculas.add(crear("Deadpool", "Mercenario bocazas.",
                                        108, LocalDate.of(2016, 2, 12), 4,
                                        "https://image.tmdb.org/t/p/w500/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
                                        getDirector.apply("Tim Miller"),
                                        List.of(getActor.apply("Ryan Reynolds"), getActor.apply("Morena Baccarin")),
                                        List.of(accion, aventura, comedia)));

                        peliculas.add(crear("Thor: Ragnarok", "Thor en Sakaar.", 130,
                                        LocalDate.of(2017, 11, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
                                        getDirector.apply("Taika Waititi"),
                                        List.of(getActor.apply("Chris Hemsworth"), getActor.apply("Cate Blanchett")),
                                        List.of(accion, aventura, scifi)));

                        peliculas.add(crear("Shazam!", "Un niño superhéroe.", 132,
                                        LocalDate.of(2019, 4, 5), 4,
                                        "https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
                                        getDirector.apply("David F. Sandberg"),
                                        List.of(getActor.apply("Zachary Levi"), getActor.apply("Asher Angel")),
                                        List.of(accion, comedia, fantasia)));

                        // 41-50: Drama
                        peliculas.add(crear("Parásitos", "Infiltración familiar.", 132,
                                        LocalDate.of(2019, 5, 30), 5,
                                        "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                                        getDirector.apply("Bong Joon-ho"),
                                        List.of(getActor.apply("Song Kang-ho")),
                                        List.of(comedia, thriller, drama)));

                        peliculas.add(crear("La La Land",
                                        "Sueños en Los Ángeles.", 128,
                                        LocalDate.of(2016, 12, 9), 5,
                                        "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
                                        getDirector.apply("Damien Chazelle"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Emma Stone")),
                                        List.of(comedia, drama, romance)));

                        peliculas.add(crear("Whiplash",
                                        "Baterista obsesivo.", 107,
                                        LocalDate.of(2014, 10, 10), 5,
                                        "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTMe8lCpNqWukBwt.jpg",
                                        getDirector.apply("Damien Chazelle"),
                                        List.of(getActor.apply("Miles Teller"), getActor.apply("J.K. Simmons")),
                                        List.of(drama)));

                        peliculas.add(crear("El lobo de Wall Street",
                                        "Auge y caída de un corredor de bolsa.", 180,
                                        LocalDate.of(2013, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
                                        getDirector.apply("Martin Scorsese"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Margot Robbie")),
                                        List.of(crimen, drama, comedia)));

                        peliculas.add(crear("El renacido", "Supervivencia y venganza.", 156,
                                        LocalDate.of(2015, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/oXUWEc5i3wYyFnL1Ycu8ppxxPvs.jpg",
                                        getDirector.apply("Alejandro González Iñárritu"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Tom Hardy")),
                                        List.of(aventura, drama, thriller)));

                        peliculas.add(crear("12 años de esclavitud",
                                        "Secuestrado y vendido.", 134,
                                        LocalDate.of(2013, 10, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/xjhLgP8PMhgcsLGC1fzsnHwCpg.jpg",
                                        getDirector.apply("Steve McQueen"),
                                        List.of(getActor.apply("Chiwetel Ejiofor"),
                                                        getActor.apply("Michael Fassbender")),
                                        List.of(drama)));

                        peliculas.add(crear("Green Book", "Viaje por el sur segregado.",
                                        130, LocalDate.of(2018, 11, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg",
                                        getDirector.apply("Peter Farrelly"),
                                        List.of(getActor.apply("Viggo Mortensen"), getActor.apply("Mahershala Ali")),
                                        List.of(drama, comedia)));

                        peliculas.add(crear("Una mente maravillosa", "John Nash.", 135,
                                        LocalDate.of(2001, 12, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/4SFqHDZ1NvWdysucWbgnYlobdxC.jpg",
                                        getDirector.apply("Ron Howard"),
                                        List.of(getActor.apply("Russell Crowe"), getActor.apply("Jennifer Connelly")),
                                        List.of(drama, romance)));

                        peliculas.add(crear("El discurso del rey", "Superar la tartamudez.", 118,
                                        LocalDate.of(2010, 11, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/uLtVcNmvJsRrttndHo6sTBoETSW.jpg",
                                        getDirector.apply("Tom Hooper"),
                                        List.of(getActor.apply("Colin Firth"), getActor.apply("Geoffrey Rush")),
                                        List.of(drama)));

                        peliculas.add(crear("El pianista", "Sobrevivir al Holocausto.", 150,
                                        LocalDate.of(2002, 9, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/2hFvxCCWrTjCnDqsG9dtrHPBj0u.jpg",
                                        getDirector.apply("Roman Polanski"),
                                        List.of(getActor.apply("Adrien Brody")),
                                        List.of(drama)));

                        // 51-60: Terror
                        peliculas.add(crear("El Resplandor", "Locura en un hotel.", 146,
                                        LocalDate.of(1980, 5, 23), 5,
                                        "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
                                        getDirector.apply("Stanley Kubrick"),
                                        List.of(getActor.apply("Jack Nicholson")),
                                        List.of(terror, thriller)));

                        peliculas.add(crear("El exorcista", "Posesión demoníaca.", 122,
                                        LocalDate.of(1973, 12, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg",
                                        getDirector.apply("William Friedkin"),
                                        List.of(getActor.apply("Linda Blair")),
                                        List.of(terror)));

                        peliculas.add(crear("Hereditary", "Herencia siniestra.", 127,
                                        LocalDate.of(2018, 6, 8), 5,
                                        "https://image.tmdb.org/t/p/w500/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
                                        getDirector.apply("Ari Aster"),
                                        List.of(getActor.apply("Toni Collette")),
                                        List.of(terror, drama, thriller)));

                        peliculas.add(crear("Midsommar", "Festival sueco.", 148,
                                        LocalDate.of(2019, 7, 3), 4,
                                        "https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCnKkHnID.jpg",
                                        getDirector.apply("Ari Aster"),
                                        List.of(getActor.apply("Florence Pugh")),
                                        List.of(terror, drama, thriller)));

                        peliculas.add(crear("Get Out", "Secreto perturbador.", 104,
                                        LocalDate.of(2017, 2, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/qbaR3VfU4DbCvBzGO4xwXphKsC.jpg",
                                        getDirector.apply("Jordan Peele"),
                                        List.of(getActor.apply("Daniel Kaluuya")),
                                        List.of(terror, thriller)));

                        peliculas.add(crear("It", "Payaso demoníaco.", 135,
                                        LocalDate.of(2017, 9, 8), 4,
                                        "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
                                        getDirector.apply("Andy Muschietti"),
                                        List.of(getActor.apply("Bill Skarsgård")),
                                        List.of(terror, fantasia)));

                        peliculas.add(crear("El conjuro", "Investigadores paranormales.",
                                        112, LocalDate.of(2013, 7, 19), 4,
                                        "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
                                        getDirector.apply("James Wan"),
                                        List.of(getActor.apply("Vera Farmiga"), getActor.apply("Patrick Wilson")),
                                        List.of(terror, thriller)));

                        peliculas.add(crear("Un lugar en silencio",
                                        "Vivir en silencio.", 90,
                                        LocalDate.of(2018, 4, 6), 4,
                                        "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
                                        getDirector.apply("John Krasinski"),
                                        List.of(getActor.apply("Emily Blunt"), getActor.apply("John Krasinski")),
                                        List.of(terror, drama, scifi)));

                        peliculas.add(crear("Seven", "Los siete pecados capitales.", 127,
                                        LocalDate.of(1995, 9, 22), 5,
                                        "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Brad Pitt"), getActor.apply("Morgan Freeman")),
                                        List.of(crimen, thriller)));

                        peliculas.add(crear("Zodiac", "El asesino del Zodiaco.", 157, LocalDate.of(2007, 3, 2),
                                        5, "https://image.tmdb.org/t/p/w500/gUlKhXY4pHwaP2X9w7gEn1YZwD.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Jake Gyllenhaal"), getActor.apply("Robert Downey Jr.")),
                                        List.of(crimen, drama, thriller)));

                        // 61-70: Animación (CRÍTICO PARA LA SECCIÓN KIDS)
                        peliculas.add(crear("El viaje de Chihiro", "Mundo de espíritus.", 125,
                                        LocalDate.of(2001, 7, 20), 5,
                                        "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
                                        getDirector.apply("Hayao Miyazaki"),
                                        List.of(getActor.apply("Rumi Hiiragi")),
                                        List.of(animacion, familia, fantasia)));

                        peliculas.add(crear("Your Name", "Intercambio de cuerpos.", 106,
                                        LocalDate.of(2016, 8, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
                                        getDirector.apply("Makoto Shinkai"),
                                        List.of(getActor.apply("Ryunosuke Kamiki")),
                                        List.of(animacion, romance, drama)));

                        peliculas.add(crear("Spider-Man: Un nuevo universo",
                                        "Miles Morales.", 117, LocalDate.of(2018, 12, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
                                        getDirector.apply("Bob Persichetti"),
                                        List.of(getActor.apply("Shameik Moore")),
                                        List.of(animacion, accion, aventura, scifi, familia)));

                        peliculas.add(crear("Coco", "Mundo de los muertos.", 105,
                                        LocalDate.of(2017, 11, 22), 5,
                                        "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
                                        getDirector.apply("Lee Unkrich"),
                                        List.of(getActor.apply("Anthony Gonzalez")),
                                        List.of(animacion, familia, fantasia)));

                        peliculas.add(crear("Toy Story 4", "Juguetes.", 100,
                                        LocalDate.of(2019, 6, 21), 4,
                                        "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
                                        getDirector.apply("Josh Cooley"),
                                        List.of(getActor.apply("Tom Hanks"), getActor.apply("Tim Allen")),
                                        List.of(animacion, familia, comedia, aventura)));

                        peliculas.add(crear("Ratatouille", "Rata chef.", 111,
                                        LocalDate.of(2007, 6, 29), 5,
                                        "https://image.tmdb.org/t/p/w500/npHNjldbeTHdKKw28bJKs7lzqzj.jpg",
                                        getDirector.apply("Brad Bird"),
                                        List.of(getActor.apply("Patton Oswalt")),
                                        List.of(animacion, comedia, familia)));

                        peliculas.add(crear("Up", "Casa voladora.", 96,
                                        LocalDate.of(2009, 5, 29), 5,
                                        "https://image.tmdb.org/t/p/w500/vpbaStTvzHeG4zP2b8H10txhcmQ.jpg",
                                        getDirector.apply("Pete Docter"),
                                        List.of(getActor.apply("Ed Asner")),
                                        List.of(animacion, comedia, familia, aventura)));

                        peliculas.add(crear("Buscando a Nemo", "Pez perdido.", 100,
                                        LocalDate.of(2003, 5, 30), 5,
                                        "https://image.tmdb.org/t/p/w500/eHuGQ10FUzJ1cvo7p1RylJIBs2b.jpg",
                                        getDirector.apply("Andrew Stanton"),
                                        List.of(getActor.apply("Albert Brooks")),
                                        List.of(animacion, familia)));

                        peliculas.add(crear("Los Increíbles", "Superhéroes.", 115,
                                        LocalDate.of(2004, 11, 5), 5,
                                        "https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg",
                                        getDirector.apply("Brad Bird"),
                                        List.of(getActor.apply("Craig T. Nelson")),
                                        List.of(animacion, familia, accion)));

                        peliculas.add(crear("Shrek", "Ogro.", 90, LocalDate.of(2001, 5, 18),
                                        5, "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
                                        getDirector.apply("Andrew Adamson"),
                                        List.of(getActor.apply("Mike Myers"), getActor.apply("Eddie Murphy")),
                                        List.of(animacion, comedia, familia, fantasia)));

                        // 71-80: Romance/Comedia
                        peliculas.add(crear("Titanic", "Barco hundido.", 194,
                                        LocalDate.of(1997, 12, 19), 5,
                                        "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Kate Winslet")),
                                        List.of(drama, romance)));

                        peliculas.add(crear("Orgullo y prejuicio", "Clásico romántico.",
                                        129, LocalDate.of(2005, 11, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/nCsLnlTzIZfj1zHq8TZsXxk298u.jpg",
                                        getDirector.apply("Joe Wright"),
                                        List.of(getActor.apply("Keira Knightley")),
                                        List.of(drama, romance)));

                        peliculas.add(crear("Crazy Rich Asians", "Boda rica.",
                                        121, LocalDate.of(2018, 8, 15), 4,
                                        "https://image.tmdb.org/t/p/w500/1XxL4LJ5WHdrcYcihEZUCgNCpAW.jpg",
                                        getDirector.apply("Jon M. Chu"),
                                        List.of(getActor.apply("Constance Wu")),
                                        List.of(comedia, drama, romance)));

                        peliculas.add(crear("Notting Hill", "Estrella de cine.", 124,
                                        LocalDate.of(1999, 5, 28), 4,
                                        "https://image.tmdb.org/t/p/w500/hvh3lHwz8D0gHm4E8vrTXCxB0Ah.jpg",
                                        getDirector.apply("Roger Michell"),
                                        List.of(getActor.apply("Hugh Grant"), getActor.apply("Julia Roberts")),
                                        List.of(romance, drama, comedia)));

                        peliculas.add(crear("Pretty Woman", "Cuento de hadas moderno.", 119,
                                        LocalDate.of(1990, 3, 23), 4,
                                        "https://image.tmdb.org/t/p/w500/oeVdMh7wvHxzyxUBbnVXCMQn0d3.jpg",
                                        getDirector.apply("Garry Marshall"),
                                        List.of(getActor.apply("Richard Gere"), getActor.apply("Julia Roberts")),
                                        List.of(romance, comedia)));

                        peliculas.add(crear("El diario de Noah", "Amor eterno.", 123,
                                        LocalDate.of(2004, 6, 25), 4,
                                        "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
                                        getDirector.apply("Nick Cassavetes"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Rachel McAdams")),
                                        List.of(romance, drama)));

                        peliculas.add(crear("Love Actually", "Navidad.", 135,
                                        LocalDate.of(2003, 11, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/2V9AdzxhRsBBbiyHm0kFp8DoMuD.jpg",
                                        getDirector.apply("Richard Curtis"),
                                        List.of(getActor.apply("Hugh Grant"), getActor.apply("Colin Firth")),
                                        List.of(romance, drama, comedia)));

                        peliculas.add(crear("Superbad", "Fiesta adolescente.", 113,
                                        LocalDate.of(2007, 8, 17), 4,
                                        "https://image.tmdb.org/t/p/w500/yAEjT7l5vyRV2VNjjnRAhfCvHjB.jpg",
                                        getDirector.apply("Greg Mottola"),
                                        List.of(getActor.apply("Jonah Hill"), getActor.apply("Michael Cera")),
                                        List.of(comedia)));

                        peliculas.add(crear("Resacón en Las Vegas", "Despedida de soltero.",
                                        100, LocalDate.of(2009, 6, 5), 4,
                                        "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxkUxMjPkCa0a0Gr.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Bradley Cooper"), getActor.apply("Zach Galifianakis")),
                                        List.of(comedia)));

                        peliculas.add(crear("Boda en Tailandia", "Despedida 2.", 102,
                                        LocalDate.of(2011, 5, 26), 4,
                                        "https://image.tmdb.org/t/p/w500/cKZu0Fdkj7dmwbfMpgDqVVCkLJQ.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Bradley Cooper")),
                                        List.of(comedia)));

                        // 81-90: Fantasía Épica
                        peliculas.add(crear("El Señor de los Anillos: La Comunidad",
                                        "El viaje comienza.", 178, LocalDate.of(2001, 12, 19), 5,
                                        "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood"), getActor.apply("Ian McKellen")),
                                        List.of(aventura, fantasia, accion)));

                        peliculas.add(crear("El Señor de los Anillos: Las Dos Torres", "Helm's Deep.",
                                        179, LocalDate.of(2002, 12, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood")),
                                        List.of(aventura, fantasia, accion)));

                        peliculas.add(crear("El Señor de los Anillos: El Retorno del Rey",
                                        "El final.", 201, LocalDate.of(2003, 12, 17), 5,
                                        "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood")),
                                        List.of(aventura, fantasia, accion)));

                        peliculas.add(crear("Harry Potter y la piedra filosofal", "El niño que vivió.", 152,
                                        LocalDate.of(2001, 11, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                                        getDirector.apply("Chris Columbus"),
                                        List.of(getActor.apply("Daniel Radcliffe"), getActor.apply("Emma Watson")),
                                        List.of(aventura, fantasia, familia)));

                        peliculas.add(crear("Harry Potter y las Reliquias de la Muerte 2",
                                        "El fin.", 130, LocalDate.of(2011, 7, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoom3.jpg",
                                        getDirector.apply("David Yates"),
                                        List.of(getActor.apply("Daniel Radcliffe")),
                                        List.of(aventura, fantasia, familia)));

                        peliculas.add(crear("Star Wars: Una nueva esperanza", "Una nueva esperanza.",
                                        121, LocalDate.of(1977, 5, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                                        getDirector.apply("George Lucas"),
                                        List.of(getActor.apply("Mark Hamill"), getActor.apply("Harrison Ford")),
                                        List.of(aventura, scifi, accion)));

                        peliculas.add(crear("Star Wars: El Imperio contraataca",
                                        "Yo soy tu padre.", 124, LocalDate.of(1980, 5, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
                                        getDirector.apply("Irvin Kershner"),
                                        List.of(getActor.apply("Mark Hamill")),
                                        List.of(aventura, scifi, accion)));

                        peliculas.add(crear("Star Wars: El Retorno del Jedi", "Final de la trilogía.",
                                        131, LocalDate.of(1983, 5, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg",
                                        getDirector.apply("Richard Marquand"),
                                        List.of(getActor.apply("Mark Hamill")),
                                        List.of(aventura, scifi, accion)));

                        peliculas.add(crear("El Hobbit: Un viaje inesperado", "Bilbo.",
                                        169, LocalDate.of(2012, 12, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/yHA9Fc37VmpUA5UncTxxo3rTGVA.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Martin Freeman")),
                                        List.of(aventura, fantasia)));

                        peliculas.add(crear("Piratas del Caribe: La maldición del Perla Negra",
                                        "Jack Sparrow.", 143, LocalDate.of(2003, 7, 9), 4,
                                        "https://image.tmdb.org/t/p/w500/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg",
                                        getDirector.apply("Gore Verbinski"),
                                        List.of(getActor.apply("Johnny Depp")),
                                        List.of(aventura, fantasia, accion)));

                        // 91-100: Varios
                        peliculas.add(crear("Django Unchained", "Venganza en el sur.", 165,
                                        LocalDate.of(2012, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Jamie Foxx"), getActor.apply("Christoph Waltz")),
                                        List.of(drama, western(categoriaRepo, "Western"))));

                        peliculas.add(crear("Kill Bill: Volumen 1", "La Novia.", 111,
                                        LocalDate.of(2003, 10, 10), 5,
                                        "https://image.tmdb.org/t/p/w500/v7TKpFDqMz4dADKI1GNeXqAYpvk.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Uma Thurman")),
                                        List.of(accion, crimen, thriller)));

                        peliculas.add(crear("Inglourious Basterds", "Cazando nazis.", 153,
                                        LocalDate.of(2009, 8, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Brad Pitt")),
                                        List.of(drama, accion, guerra(categoriaRepo, "Guerra"))));

                        peliculas.add(crear("Jurassic Park", "Dinosaurios.", 127,
                                        LocalDate.of(1993, 6, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/b1NyaHo8h5ZRQ3jiEDOrpsCseAo.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Sam Neill")),
                                        List.of(aventura, scifi)));

                        peliculas.add(crear("E.T. el extraterrestre", "Amigo alienígena.",
                                        115, LocalDate.of(1982, 6, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/an0nD6uq6bLxj4eNrpBQVTqdO6j.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Henry Thomas")),
                                        List.of(scifi, aventura, familia)));

                        peliculas.add(crear("La lista de Schindler", "Holocausto.",
                                        195, LocalDate.of(1993, 12, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Liam Neeson")),
                                        List.of(drama, guerra(categoriaRepo, "Guerra"))));

                        peliculas.add(crear("Salvar al soldado Ryan", "Desembarco de Normandía.",
                                        169, LocalDate.of(1998, 7, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IuATPZ9.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Tom Hanks")),
                                        List.of(drama, guerra(categoriaRepo, "Guerra"), accion)));

                        peliculas.add(crear("Regreso al futuro", "Viaje en el tiempo.", 116,
                                        LocalDate.of(1985, 7, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
                                        getDirector.apply("Robert Zemeckis"),
                                        List.of(getActor.apply("Michael J. Fox")),
                                        List.of(aventura, comedia, scifi)));

                        peliculas.add(crear("Indiana Jones: En busca del arca perdida",
                                        "Arqueología extrema.", 115, LocalDate.of(1981, 6, 12), 5,
                                        "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Harrison Ford")),
                                        List.of(aventura, accion)));

                        peliculas.add(crear("Rocky", "Boxeo.", 120,
                                        LocalDate.of(1976, 11, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/cqFzPD5S7mjpetCw1DWUWYj5ap.jpg",
                                        getDirector.apply("John G. Avildsen"),
                                        List.of(getActor.apply("Sylvester Stallone")),
                                        List.of(drama)));

                        // --- LOGICA NUEVA PARA IDIOMAS Y PLATAFORMAS ---
                        List<Idioma> listaIdiomas = List
                                        .of("Español", "Inglés", "Francés", "Alemán", "Italiano", "Japonés", "Coreano")
                                        .stream().map(nombre -> {
                                                Idioma i = new Idioma();
                                                i.setNombre(nombre);
                                                return idiomaRepo.save(i);
                                        }).collect(Collectors.toList());

                        List<Plataforma> listaPlataformas = new ArrayList<>();
                        Map<String, String> platformsData = Map.of(
                                        "Netflix", "https://www.netflix.com",
                                        "Amazon Prime Video", "https://www.primevideo.com",
                                        "Disney+", "https://www.disneyplus.com",
                                        "HBO Max", "https://www.hbomax.com",
                                        "Apple TV+", "https://tv.apple.com");

                        platformsData.forEach((k, v) -> {
                                Plataforma p = new Plataforma();
                                p.setNombre(k);
                                p.setUrl(v);
                                listaPlataformas.add(plataformaRepo.save(p));
                        });

                        Random random = new Random();

                        peliculas.forEach(p -> {
                                // Asignar Idiomas (Siempre inglés + español + random)
                                Set<Idioma> movieIdiomas = new HashSet<>();
                                movieIdiomas.add(listaIdiomas.get(1)); // Inglés
                                if (random.nextBoolean())
                                        movieIdiomas.add(listaIdiomas.get(0)); // Español
                                if (random.nextDouble() > 0.7)
                                        movieIdiomas.add(listaIdiomas.get(random.nextInt(listaIdiomas.size())));
                                p.setIdiomas(new ArrayList<>(movieIdiomas));

                                // Asignar Plataformas (Random 1-3)
                                Set<Plataforma> moviePlats = new HashSet<>();
                                int numPlats = random.nextInt(3) + 1;
                                for (int i = 0; i < numPlats; i++) {
                                        moviePlats.add(listaPlataformas.get(random.nextInt(listaPlataformas.size())));
                                }
                                p.setPlataformas(new ArrayList<>(moviePlats));
                        });

                        peliculaRepo.saveAll(peliculas);
                        System.out.println("✅ CATÁLOGO COMPLETO CON CATEGORÍAS: " + peliculas.size()
                                        + " películas cargadas");
                };
        }

        // Helper para categorías menos comunes, creadas al vuelo si es necesario
        private Categoria western(CategoriaRepository repo, String nombre) {
                return repo.findByNombre(nombre).orElseGet(() -> {
                        Categoria c = new Categoria();
                        c.setNombre(nombre);
                        return repo.save(c);
                });
        }

        private Categoria guerra(CategoriaRepository repo, String nombre) {
                return repo.findByNombre(nombre).orElseGet(() -> {
                        Categoria c = new Categoria();
                        c.setNombre(nombre);
                        return repo.save(c);
                });
        }

        private Pelicula crear(String titulo, String sinopsis, Integer duracion, LocalDate fecha, Integer valoracion,
                        String url, Director director, List<Actor> actoresList, List<Categoria> categoriasList) {
                Pelicula p = new Pelicula();
                p.setTitulo(titulo);
                p.setSinopsis(sinopsis);
                p.setDuracion(duracion);
                p.setFechaEstreno(fecha);
                p.setValoracion(valoracion);
                p.setImagenUrl(url);
                p.setDirector(director);
                p.setActores(new ArrayList<>(actoresList));
                p.setCategorias(new ArrayList<>(categoriasList != null ? categoriasList : new ArrayList<>()));
                return p;
        }
}