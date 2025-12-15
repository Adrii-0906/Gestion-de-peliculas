package com.gestionPeliculas;

import com.gestionPeliculas.domain.*;
import com.gestionPeliculas.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.*;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(PeliculaRepository peliculaRepo,
                        DirectorRepository directorRepo,
                        ActorRepository actorRepo) {
                return args -> {
                        if (peliculaRepo.count() > 0) {
                                System.out.println(">>> Datos ya existentes. NO se carga DataSeeder.");
                                return;
                        }

                        System.out.println(">>> CARGANDO CATÁLOGO DE 100 PELÍCULAS...");

                        Map<String, Director> directores = new HashMap<>();
                        Map<String, Actor> actores = new HashMap<>();

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

                        List<Pelicula> peliculas = new ArrayList<>();

                        // 1-10: Películas de acción modernas
                        peliculas.add(crear("Dune: Parte Dos",
                                        "Paul Atreides se une a los Fremen en una guerra contra los Harkonnen.", 166,
                                        LocalDate.of(2024, 3, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Timothée Chalamet"), getActor.apply("Zendaya"),
                                                        getActor.apply("Rebecca Ferguson"))));
                        peliculas.add(crear("Oppenheimer",
                                        "La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.",
                                        180, LocalDate.of(2023, 7, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Cillian Murphy"), getActor.apply("Emily Blunt"),
                                                        getActor.apply("Robert Downey Jr."))));
                        peliculas.add(crear("Top Gun: Maverick",
                                        "Pete Mitchell entrena a una nueva generación de pilotos de élite.", 130,
                                        LocalDate.of(2022, 5, 27), 5,
                                        "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                                        getDirector.apply("Joseph Kosinski"),
                                        List.of(getActor.apply("Tom Cruise"), getActor.apply("Miles Teller"),
                                                        getActor.apply("Jennifer Connelly"))));
                        peliculas.add(crear("John Wick 4", "John Wick descubre un camino para derrotar a la Alta Mesa.",
                                        169, LocalDate.of(2023, 3, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
                                        getDirector.apply("Chad Stahelski"),
                                        List.of(getActor.apply("Keanu Reeves"), getActor.apply("Donnie Yen"),
                                                        getActor.apply("Bill Skarsgård"))));
                        peliculas.add(crear("Avatar: El sentido del agua",
                                        "Jake Sully y su familia enfrentan una nueva amenaza.", 192,
                                        LocalDate.of(2022, 12, 16), 4,
                                        "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Sam Worthington"), getActor.apply("Zoe Saldaña"),
                                                        getActor.apply("Sigourney Weaver"))));
                        peliculas.add(crear("Mad Max: Furia en la carretera",
                                        "En un futuro postapocalíptico, Max ayuda a Furiosa a escapar.", 120,
                                        LocalDate.of(2015, 5, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
                                        getDirector.apply("George Miller"),
                                        List.of(getActor.apply("Tom Hardy"), getActor.apply("Charlize Theron"),
                                                        getActor.apply("Nicholas Hoult"))));
                        peliculas.add(crear("Gladiator",
                                        "Un general romano busca venganza contra el emperador corrupto.", 155,
                                        LocalDate.of(2000, 5, 5), 5,
                                        "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
                                        getDirector.apply("Ridley Scott"),
                                        List.of(getActor.apply("Russell Crowe"), getActor.apply("Joaquin Phoenix"),
                                                        getActor.apply("Connie Nielsen"))));
                        peliculas.add(crear("Matrix", "Un hacker descubre la verdadera naturaleza de su realidad.", 136,
                                        LocalDate.of(1999, 3, 31), 5,
                                        "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                                        getDirector.apply("Lana Wachowski"),
                                        List.of(getActor.apply("Keanu Reeves"), getActor.apply("Laurence Fishburne"),
                                                        getActor.apply("Carrie-Anne Moss"))));
                        peliculas.add(crear("Origen", "Un ladrón que roba secretos a través de los sueños.", 148,
                                        LocalDate.of(2010, 7, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Leonardo DiCaprio"),
                                                        getActor.apply("Joseph Gordon-Levitt"),
                                                        getActor.apply("Ellen Page"))));
                        peliculas.add(crear("El caballero oscuro",
                                        "Batman enfrenta al Joker, un criminal que siembra el caos en Gotham.", 152,
                                        LocalDate.of(2008, 7, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Christian Bale"), getActor.apply("Heath Ledger"),
                                                        getActor.apply("Aaron Eckhart"))));

                        // 11-20: Clásicos del cine
                        peliculas.add(crear("El Padrino", "La saga de la familia mafiosa Corleone.", 175,
                                        LocalDate.of(1972, 3, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                                        getDirector.apply("Francis Ford Coppola"),
                                        List.of(getActor.apply("Marlon Brando"), getActor.apply("Al Pacino"),
                                                        getActor.apply("James Caan"))));
                        peliculas.add(crear("Pulp Fiction", "Historias entrelazadas de criminales en Los Ángeles.", 154,
                                        LocalDate.of(1994, 10, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("John Travolta"), getActor.apply("Uma Thurman"),
                                                        getActor.apply("Samuel L. Jackson"))));
                        peliculas.add(crear("Forrest Gump", "La vida extraordinaria de un hombre simple.", 142,
                                        LocalDate.of(1994, 7, 6), 5,
                                        "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                                        getDirector.apply("Robert Zemeckis"),
                                        List.of(getActor.apply("Tom Hanks"), getActor.apply("Robin Wright"),
                                                        getActor.apply("Gary Sinise"))));
                        peliculas.add(crear("Cadena perpetua",
                                        "Dos prisioneros forjan una amistad a lo largo de los años.", 142,
                                        LocalDate.of(1994, 9, 23), 5,
                                        "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                                        getDirector.apply("Frank Darabont"),
                                        List.of(getActor.apply("Tim Robbins"), getActor.apply("Morgan Freeman"))));
                        peliculas.add(crear("El club de la lucha",
                                        "Un hombre insomne forma un club de lucha clandestino.", 139,
                                        LocalDate.of(1999, 10, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Brad Pitt"), getActor.apply("Edward Norton"),
                                                        getActor.apply("Helena Bonham Carter"))));
                        peliculas.add(crear("El silencio de los corderos",
                                        "Una agente del FBI busca ayuda de un asesino caníbal.", 118,
                                        LocalDate.of(1991, 2, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
                                        getDirector.apply("Jonathan Demme"),
                                        List.of(getActor.apply("Jodie Foster"), getActor.apply("Anthony Hopkins"))));
                        peliculas.add(crear("Psicosis", "Una secretaria roba dinero y se aloja en un motel siniestro.",
                                        109, LocalDate.of(1960, 6, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
                                        getDirector.apply("Alfred Hitchcock"),
                                        List.of(getActor.apply("Anthony Perkins"), getActor.apply("Janet Leigh"))));
                        peliculas.add(crear("Ciudadano Kane", "La vida de un magnate de la prensa.", 119,
                                        LocalDate.of(1941, 5, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
                                        getDirector.apply("Orson Welles"),
                                        List.of(getActor.apply("Orson Welles"), getActor.apply("Joseph Cotten"))));
                        peliculas.add(crear("Casablanca", "Un expatriado americano debe elegir entre amor y deber.",
                                        102, LocalDate.of(1942, 11, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
                                        getDirector.apply("Michael Curtiz"),
                                        List.of(getActor.apply("Humphrey Bogart"), getActor.apply("Ingrid Bergman"))));
                        peliculas.add(crear("Lo que el viento se llevó",
                                        "Una historia de amor durante la Guerra Civil americana.", 238,
                                        LocalDate.of(1939, 12, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/bv3ub7wQRNnpyXzBCMmEsDvOBT5.jpg",
                                        getDirector.apply("Victor Fleming"),
                                        List.of(getActor.apply("Vivien Leigh"), getActor.apply("Clark Gable"))));

                        // 21-30: Ciencia ficción
                        peliculas.add(crear("Blade Runner 2049", "Un nuevo blade runner descubre un secreto enterrado.",
                                        164, LocalDate.of(2017, 10, 6), 5,
                                        "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Harrison Ford"),
                                                        getActor.apply("Ana de Armas"))));
                        peliculas.add(crear("Interstellar",
                                        "Un grupo de exploradores viaja a través de un agujero de gusano.", 169,
                                        LocalDate.of(2014, 11, 7), 5,
                                        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                                        getDirector.apply("Christopher Nolan"),
                                        List.of(getActor.apply("Matthew McConaughey"), getActor.apply("Anne Hathaway"),
                                                        getActor.apply("Jessica Chastain"))));
                        peliculas.add(crear("Arrival", "Una lingüista intenta comunicarse con extraterrestres.", 116,
                                        LocalDate.of(2016, 11, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
                                        getDirector.apply("Denis Villeneuve"),
                                        List.of(getActor.apply("Amy Adams"), getActor.apply("Jeremy Renner"))));
                        peliculas.add(crear("Ex Machina", "Un programador es invitado a evaluar una IA.", 108,
                                        LocalDate.of(2015, 1, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/btbRB7BrD887j5NrvjxceRDmaot.jpg",
                                        getDirector.apply("Alex Garland"),
                                        List.of(getActor.apply("Domhnall Gleeson"), getActor.apply("Alicia Vikander"),
                                                        getActor.apply("Oscar Isaac"))));
                        peliculas.add(crear("Her", "Un hombre se enamora de un sistema operativo con IA.", 126,
                                        LocalDate.of(2013, 12, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/yk4J4aewWYNiBhD49Ls5rTXEldC.jpg",
                                        getDirector.apply("Spike Jonze"), List.of(getActor.apply("Joaquin Phoenix"),
                                                        getActor.apply("Scarlett Johansson"))));
                        peliculas.add(crear("Gravity", "Dos astronautas luchan por sobrevivir en el espacio.", 91,
                                        LocalDate.of(2013, 10, 4), 5,
                                        "https://image.tmdb.org/t/p/w500/uPxtxhB2Fy9ihVqtBtNGHmknJqV.jpg",
                                        getDirector.apply("Alfonso Cuarón"),
                                        List.of(getActor.apply("Sandra Bullock"), getActor.apply("George Clooney"))));
                        peliculas.add(crear("The Martian",
                                        "Un astronauta queda varado en Marte y lucha por sobrevivir.", 144,
                                        LocalDate.of(2015, 10, 2), 5,
                                        "https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
                                        getDirector.apply("Ridley Scott"),
                                        List.of(getActor.apply("Matt Damon"), getActor.apply("Jessica Chastain"),
                                                        getActor.apply("Kate Mara"))));
                        peliculas.add(crear("District 9", "Alienígenas varados en la Tierra viven en un gueto.", 112,
                                        LocalDate.of(2009, 8, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/axFmCRNQsLxfHpPNprc5ybMb4To.jpg",
                                        getDirector.apply("Neill Blomkamp"),
                                        List.of(getActor.apply("Sharlto Copley"))));
                        peliculas.add(crear("Edge of Tomorrow",
                                        "Un soldado revive el mismo día de batalla una y otra vez.", 113,
                                        LocalDate.of(2014, 6, 6), 4,
                                        "https://image.tmdb.org/t/p/w500/xjw5trHV7Eng6EM9OoRlBNPfEME.jpg",
                                        getDirector.apply("Doug Liman"),
                                        List.of(getActor.apply("Tom Cruise"), getActor.apply("Emily Blunt"))));
                        peliculas.add(crear("Terminator 2", "Un cyborg protege al futuro líder de la resistencia.", 137,
                                        LocalDate.of(1991, 7, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Arnold Schwarzenegger"),
                                                        getActor.apply("Linda Hamilton"),
                                                        getActor.apply("Edward Furlong"))));

                        // 31-40: Superhéroes y Marvel/DC
                        peliculas.add(crear("Avengers: Endgame",
                                        "Los Vengadores intentan revertir el chasquido de Thanos.", 181,
                                        LocalDate.of(2019, 4, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                                        getDirector.apply("Anthony Russo"),
                                        List.of(getActor.apply("Robert Downey Jr."), getActor.apply("Chris Evans"),
                                                        getActor.apply("Scarlett Johansson"))));
                        peliculas.add(crear("Spider-Man: No Way Home",
                                        "Peter Parker enfrenta las consecuencias de su identidad revelada.", 148,
                                        LocalDate.of(2021, 12, 17), 5,
                                        "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                                        getDirector.apply("Jon Watts"),
                                        List.of(getActor.apply("Tom Holland"), getActor.apply("Zendaya"),
                                                        getActor.apply("Benedict Cumberbatch"))));
                        peliculas.add(crear("Black Panther", "T'Challa regresa a Wakanda para ser coronado rey.", 134,
                                        LocalDate.of(2018, 2, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
                                        getDirector.apply("Ryan Coogler"),
                                        List.of(getActor.apply("Chadwick Boseman"), getActor.apply("Michael B. Jordan"),
                                                        getActor.apply("Lupita Nyong'o"))));
                        peliculas.add(crear("Guardianes de la Galaxia",
                                        "Un grupo de inadaptados se une para salvar la galaxia.", 121,
                                        LocalDate.of(2014, 8, 1), 5,
                                        "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJhqpkWIBCvB.jpg",
                                        getDirector.apply("James Gunn"),
                                        List.of(getActor.apply("Chris Pratt"), getActor.apply("Zoe Saldaña"),
                                                        getActor.apply("Dave Bautista"))));
                        peliculas.add(crear("Wonder Woman", "Diana de Themyscira se convierte en Wonder Woman.", 141,
                                        LocalDate.of(2017, 6, 2), 4,
                                        "https://image.tmdb.org/t/p/w500/gfJGlDaHuWimTpvGLJhodgs9bS9.jpg",
                                        getDirector.apply("Patty Jenkins"),
                                        List.of(getActor.apply("Gal Gadot"), getActor.apply("Chris Pine"))));
                        peliculas.add(crear("Joker", "El origen del villano más famoso de Gotham.", 122,
                                        LocalDate.of(2019, 10, 4), 5,
                                        "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Joaquin Phoenix"), getActor.apply("Robert De Niro"))));
                        peliculas.add(crear("Logan", "Un Wolverine envejecido cuida del profesor X.", 137,
                                        LocalDate.of(2017, 3, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
                                        getDirector.apply("James Mangold"),
                                        List.of(getActor.apply("Hugh Jackman"), getActor.apply("Patrick Stewart"),
                                                        getActor.apply("Dafne Keen"))));
                        peliculas.add(crear("Deadpool", "Un mercenario con poderes de regeneración busca venganza.",
                                        108, LocalDate.of(2016, 2, 12), 4,
                                        "https://image.tmdb.org/t/p/w500/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
                                        getDirector.apply("Tim Miller"),
                                        List.of(getActor.apply("Ryan Reynolds"), getActor.apply("Morena Baccarin"))));
                        peliculas.add(crear("Thor: Ragnarok", "Thor debe escapar de Sakaar y salvar Asgard.", 130,
                                        LocalDate.of(2017, 11, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
                                        getDirector.apply("Taika Waititi"),
                                        List.of(getActor.apply("Chris Hemsworth"), getActor.apply("Tom Hiddleston"),
                                                        getActor.apply("Cate Blanchett"))));
                        peliculas.add(crear("Shazam!", "Un adolescente obtiene superpoderes al decir Shazam.", 132,
                                        LocalDate.of(2019, 4, 5), 4,
                                        "https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
                                        getDirector.apply("David F. Sandberg"),
                                        List.of(getActor.apply("Zachary Levi"), getActor.apply("Asher Angel"))));

                        // 41-50: Drama
                        peliculas.add(crear("Parásitos", "Una familia pobre se infiltra en una familia rica.", 132,
                                        LocalDate.of(2019, 5, 30), 5,
                                        "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                                        getDirector.apply("Bong Joon-ho"),
                                        List.of(getActor.apply("Song Kang-ho"), getActor.apply("Choi Woo-shik"),
                                                        getActor.apply("Park So-dam"))));
                        peliculas.add(crear("La La Land",
                                        "Un pianista y una actriz persiguen sus sueños en Los Ángeles.", 128,
                                        LocalDate.of(2016, 12, 9), 5,
                                        "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
                                        getDirector.apply("Damien Chazelle"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Emma Stone"))));
                        peliculas.add(crear("Whiplash",
                                        "Un joven baterista busca la perfección bajo un instructor brutal.", 107,
                                        LocalDate.of(2014, 10, 10), 5,
                                        "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTMe8lCpNqWukBwt.jpg",
                                        getDirector.apply("Damien Chazelle"),
                                        List.of(getActor.apply("Miles Teller"), getActor.apply("J.K. Simmons"))));
                        peliculas.add(crear("El lobo de Wall Street",
                                        "La historia del corredor de bolsa Jordan Belfort.", 180,
                                        LocalDate.of(2013, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
                                        getDirector.apply("Martin Scorsese"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Jonah Hill"),
                                                        getActor.apply("Margot Robbie"))));
                        peliculas.add(crear("El renacido", "Un explorador abandonado lucha por sobrevivir.", 156,
                                        LocalDate.of(2015, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/oXUWEc5i3wYyFnL1Ycu8ppxxPvs.jpg",
                                        getDirector.apply("Alejandro González Iñárritu"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Tom Hardy"))));
                        peliculas.add(crear("12 años de esclavitud",
                                        "Un hombre libre es secuestrado y vendido como esclavo.", 134,
                                        LocalDate.of(2013, 10, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/xjhLgP8PMhgcsLGC1fzsnHwCpg.jpg",
                                        getDirector.apply("Steve McQueen"),
                                        List.of(getActor.apply("Chiwetel Ejiofor"),
                                                        getActor.apply("Michael Fassbender"),
                                                        getActor.apply("Lupita Nyong'o"))));
                        peliculas.add(crear("Green Book", "Un pianista negro y su chofer viajan por el sur segregado.",
                                        130, LocalDate.of(2018, 11, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg",
                                        getDirector.apply("Peter Farrelly"),
                                        List.of(getActor.apply("Viggo Mortensen"), getActor.apply("Mahershala Ali"))));
                        peliculas.add(crear("Una mente maravillosa", "La vida del matemático John Nash.", 135,
                                        LocalDate.of(2001, 12, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/4SFqHDZ1NvWdysucWbgnYlobdxC.jpg",
                                        getDirector.apply("Ron Howard"),
                                        List.of(getActor.apply("Russell Crowe"), getActor.apply("Jennifer Connelly"))));
                        peliculas.add(crear("El discurso del rey", "Jorge VI supera su tartamudez.", 118,
                                        LocalDate.of(2010, 11, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/uLtVcNmvJsRrttndHo6sTBoETSW.jpg",
                                        getDirector.apply("Tom Hooper"),
                                        List.of(getActor.apply("Colin Firth"), getActor.apply("Geoffrey Rush"),
                                                        getActor.apply("Helena Bonham Carter"))));
                        peliculas.add(crear("El pianista", "Un pianista judío polaco sobrevive al Holocausto.", 150,
                                        LocalDate.of(2002, 9, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/2hFvxCCWrTjCnDqsG9dtrHPBj0u.jpg",
                                        getDirector.apply("Roman Polanski"), List.of(getActor.apply("Adrien Brody"))));

                        // 51-60: Terror y Thriller
                        peliculas.add(crear("El Resplandor", "Un escritor se vuelve loco en un hotel aislado.", 146,
                                        LocalDate.of(1980, 5, 23), 5,
                                        "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
                                        getDirector.apply("Stanley Kubrick"),
                                        List.of(getActor.apply("Jack Nicholson"), getActor.apply("Shelley Duvall"))));
                        peliculas.add(crear("El exorcista", "Una madre busca ayuda para su hija poseída.", 122,
                                        LocalDate.of(1973, 12, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg",
                                        getDirector.apply("William Friedkin"),
                                        List.of(getActor.apply("Linda Blair"), getActor.apply("Ellen Burstyn"))));
                        peliculas.add(crear("Hereditary", "Una familia es perseguida por una presencia siniestra.", 127,
                                        LocalDate.of(2018, 6, 8), 5,
                                        "https://image.tmdb.org/t/p/w500/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
                                        getDirector.apply("Ari Aster"),
                                        List.of(getActor.apply("Toni Collette"), getActor.apply("Alex Wolff"))));
                        peliculas.add(crear("Midsommar", "Un grupo de amigos viaja a un festival sueco.", 148,
                                        LocalDate.of(2019, 7, 3), 4,
                                        "https://image.tmdb.org/t/p/w500/7LEI8ulZzO5gy9Ww2NVCnKkHnID.jpg",
                                        getDirector.apply("Ari Aster"),
                                        List.of(getActor.apply("Florence Pugh"), getActor.apply("Jack Reynor"))));
                        peliculas.add(crear("Get Out", "Un hombre descubre un secreto perturbador.", 104,
                                        LocalDate.of(2017, 2, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/qbaR3VfU4DbCvBzGO4xwXphKsC.jpg",
                                        getDirector.apply("Jordan Peele"),
                                        List.of(getActor.apply("Daniel Kaluuya"), getActor.apply("Allison Williams"))));
                        peliculas.add(crear("It", "Un grupo de niños enfrenta a un payaso demoníaco.", 135,
                                        LocalDate.of(2017, 9, 8), 4,
                                        "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
                                        getDirector.apply("Andy Muschietti"),
                                        List.of(getActor.apply("Bill Skarsgård"), getActor.apply("Jaeden Martell"))));
                        peliculas.add(crear("El conjuro", "Investigadores paranormales enfrentan un caso aterrador.",
                                        112, LocalDate.of(2013, 7, 19), 4,
                                        "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
                                        getDirector.apply("James Wan"),
                                        List.of(getActor.apply("Vera Farmiga"), getActor.apply("Patrick Wilson"))));
                        peliculas.add(crear("Un lugar en silencio",
                                        "Una familia debe vivir en silencio para sobrevivir.", 90,
                                        LocalDate.of(2018, 4, 6), 4,
                                        "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
                                        getDirector.apply("John Krasinski"),
                                        List.of(getActor.apply("Emily Blunt"), getActor.apply("John Krasinski"))));
                        peliculas.add(crear("Seven", "Dos detectives cazan a un asesino serial.", 127,
                                        LocalDate.of(1995, 9, 22), 5,
                                        "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Brad Pitt"), getActor.apply("Morgan Freeman"),
                                                        getActor.apply("Gwyneth Paltrow"))));
                        peliculas.add(crear("Zodiac", "La caza del asesino del Zodiaco.", 157, LocalDate.of(2007, 3, 2),
                                        5, "https://image.tmdb.org/t/p/w500/gUlKhXY4pHwaP2X9w7gEn1YZwD.jpg",
                                        getDirector.apply("David Fincher"),
                                        List.of(getActor.apply("Jake Gyllenhaal"), getActor.apply("Mark Ruffalo"),
                                                        getActor.apply("Robert Downey Jr."))));

                        // 61-70: Animación
                        peliculas.add(crear("El viaje de Chihiro", "Una niña entra en un mundo de espíritus.", 125,
                                        LocalDate.of(2001, 7, 20), 5,
                                        "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
                                        getDirector.apply("Hayao Miyazaki"), List.of(getActor.apply("Rumi Hiiragi"))));
                        peliculas.add(crear("Your Name", "Dos adolescentes intercambian cuerpos misteriosamente.", 106,
                                        LocalDate.of(2016, 8, 26), 5,
                                        "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
                                        getDirector.apply("Makoto Shinkai"), List.of(getActor.apply("Ryunosuke Kamiki"),
                                                        getActor.apply("Mone Kamishiraishi"))));
                        peliculas.add(crear("Spider-Man: Un nuevo universo",
                                        "Miles Morales se convierte en Spider-Man.", 117, LocalDate.of(2018, 12, 14), 5,
                                        "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
                                        getDirector.apply("Bob Persichetti"),
                                        List.of(getActor.apply("Shameik Moore"), getActor.apply("Hailee Steinfeld"))));
                        peliculas.add(crear("Coco", "Un niño viaja al mundo de los muertos.", 105,
                                        LocalDate.of(2017, 11, 22), 5,
                                        "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
                                        getDirector.apply("Lee Unkrich"), List.of(getActor.apply("Anthony Gonzalez"),
                                                        getActor.apply("Gael García Bernal"))));
                        peliculas.add(crear("Toy Story 4", "Woody y Buzz en una nueva aventura.", 100,
                                        LocalDate.of(2019, 6, 21), 4,
                                        "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
                                        getDirector.apply("Josh Cooley"),
                                        List.of(getActor.apply("Tom Hanks"), getActor.apply("Tim Allen"))));
                        peliculas.add(crear("Ratatouille", "Una rata sueña con ser chef en París.", 111,
                                        LocalDate.of(2007, 6, 29), 5,
                                        "https://image.tmdb.org/t/p/w500/npHNjldbeTHdKKw28bJKs7lzqzj.jpg",
                                        getDirector.apply("Brad Bird"),
                                        List.of(getActor.apply("Patton Oswalt"), getActor.apply("Lou Romano"))));
                        peliculas.add(crear("Up", "Un anciano viaja a Sudamérica en su casa voladora.", 96,
                                        LocalDate.of(2009, 5, 29), 5,
                                        "https://image.tmdb.org/t/p/w500/vpbaStTvzHeG4zP2b8H10txhcmQ.jpg",
                                        getDirector.apply("Pete Docter"),
                                        List.of(getActor.apply("Ed Asner"), getActor.apply("Jordan Nagai"))));
                        peliculas.add(crear("Buscando a Nemo", "Un pez payaso busca a su hijo perdido.", 100,
                                        LocalDate.of(2003, 5, 30), 5,
                                        "https://image.tmdb.org/t/p/w500/eHuGQ10FUzJ1cvo7p1RylJIBs2b.jpg",
                                        getDirector.apply("Andrew Stanton"),
                                        List.of(getActor.apply("Albert Brooks"), getActor.apply("Ellen DeGeneres"))));
                        peliculas.add(crear("Los Increíbles", "Una familia de superhéroes sale del retiro.", 115,
                                        LocalDate.of(2004, 11, 5), 5,
                                        "https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg",
                                        getDirector.apply("Brad Bird"),
                                        List.of(getActor.apply("Craig T. Nelson"), getActor.apply("Holly Hunter"))));
                        peliculas.add(crear("Shrek", "Un ogro rescata a una princesa.", 90, LocalDate.of(2001, 5, 18),
                                        5, "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
                                        getDirector.apply("Andrew Adamson"),
                                        List.of(getActor.apply("Mike Myers"), getActor.apply("Eddie Murphy"),
                                                        getActor.apply("Cameron Diaz"))));

                        // 71-80: Romance y Comedia
                        peliculas.add(crear("Titanic", "Una historia de amor en el barco más famoso.", 194,
                                        LocalDate.of(1997, 12, 19), 5,
                                        "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                                        getDirector.apply("James Cameron"),
                                        List.of(getActor.apply("Leonardo DiCaprio"), getActor.apply("Kate Winslet"))));
                        peliculas.add(crear("Orgullo y prejuicio", "Elizabeth Bennet conoce al orgulloso Mr. Darcy.",
                                        129, LocalDate.of(2005, 11, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/nCsLnlTzIZfj1zHq8TZsXxk298u.jpg",
                                        getDirector.apply("Joe Wright"), List.of(getActor.apply("Keira Knightley"),
                                                        getActor.apply("Matthew Macfadyen"))));
                        peliculas.add(crear("Crazy Rich Asians", "Una profesora conoce a la rica familia de su novio.",
                                        121, LocalDate.of(2018, 8, 15), 4,
                                        "https://image.tmdb.org/t/p/w500/1XxL4LJ5WHdrcYcihEZUCgNCpAW.jpg",
                                        getDirector.apply("Jon M. Chu"),
                                        List.of(getActor.apply("Constance Wu"), getActor.apply("Henry Golding"))));
                        peliculas.add(crear("Notting Hill", "Un librero se enamora de una estrella de cine.", 124,
                                        LocalDate.of(1999, 5, 28), 4,
                                        "https://image.tmdb.org/t/p/w500/hvh3lHwz8D0gHm4E8vrTXCxB0Ah.jpg",
                                        getDirector.apply("Roger Michell"),
                                        List.of(getActor.apply("Hugh Grant"), getActor.apply("Julia Roberts"))));
                        peliculas.add(crear("Pretty Woman", "Un empresario se enamora de una prostituta.", 119,
                                        LocalDate.of(1990, 3, 23), 4,
                                        "https://image.tmdb.org/t/p/w500/oeVdMh7wvHxzyxUBbnVXCMQn0d3.jpg",
                                        getDirector.apply("Garry Marshall"),
                                        List.of(getActor.apply("Richard Gere"), getActor.apply("Julia Roberts"))));
                        peliculas.add(crear("El diario de Noah", "Una historia de amor que trasciende el tiempo.", 123,
                                        LocalDate.of(2004, 6, 25), 4,
                                        "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
                                        getDirector.apply("Nick Cassavetes"),
                                        List.of(getActor.apply("Ryan Gosling"), getActor.apply("Rachel McAdams"))));
                        peliculas.add(crear("Love Actually", "Historias de amor entrelazadas en Navidad.", 135,
                                        LocalDate.of(2003, 11, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/2V9AdzxhRsBBbiyHm0kFp8DoMuD.jpg",
                                        getDirector.apply("Richard Curtis"),
                                        List.of(getActor.apply("Hugh Grant"), getActor.apply("Keira Knightley"),
                                                        getActor.apply("Colin Firth"))));
                        peliculas.add(crear("Superbad", "Dos amigos intentan conseguir alcohol para una fiesta.", 113,
                                        LocalDate.of(2007, 8, 17), 4,
                                        "https://image.tmdb.org/t/p/w500/yAEjT7l5vyRV2VNjjnRAhfCvHjB.jpg",
                                        getDirector.apply("Greg Mottola"),
                                        List.of(getActor.apply("Jonah Hill"), getActor.apply("Michael Cera"))));
                        peliculas.add(crear("Resacón en Las Vegas", "Tres amigos pierden al novio en su despedida.",
                                        100, LocalDate.of(2009, 6, 5), 4,
                                        "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxkUxMjPkCa0a0Gr.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Bradley Cooper"), getActor.apply("Ed Helms"),
                                                        getActor.apply("Zach Galifianakis"))));
                        peliculas.add(crear("Boda en Tailandia", "Philip y Stu celebran una boda en Bangkok.", 102,
                                        LocalDate.of(2011, 5, 26), 4,
                                        "https://image.tmdb.org/t/p/w500/uvGqN0R1g7uPeGbVAfW0rQ7nqFI.jpg",
                                        getDirector.apply("Todd Phillips"),
                                        List.of(getActor.apply("Bradley Cooper"), getActor.apply("Ed Helms"),
                                                        getActor.apply("Zach Galifianakis"))));

                        // 81-90: El Señor de los Anillos, Harry Potter, Star Wars
                        peliculas.add(crear("El Señor de los Anillos: La Comunidad",
                                        "Un hobbit emprende un viaje épico.", 178, LocalDate.of(2001, 12, 19), 5,
                                        "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood"), getActor.apply("Ian McKellen"),
                                                        getActor.apply("Viggo Mortensen"))));
                        peliculas.add(crear("El Señor de los Anillos: Las Dos Torres", "La batalla de Helm's Deep.",
                                        179, LocalDate.of(2002, 12, 18), 5,
                                        "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood"), getActor.apply("Ian McKellen"),
                                                        getActor.apply("Viggo Mortensen"))));
                        peliculas.add(crear("El Señor de los Anillos: El Retorno del Rey",
                                        "La batalla final por la Tierra Media.", 201, LocalDate.of(2003, 12, 17), 5,
                                        "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Elijah Wood"), getActor.apply("Ian McKellen"),
                                                        getActor.apply("Viggo Mortensen"))));
                        peliculas.add(crear("Harry Potter y la piedra filosofal", "Harry descubre que es un mago.", 152,
                                        LocalDate.of(2001, 11, 16), 5,
                                        "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                                        getDirector.apply("Chris Columbus"),
                                        List.of(getActor.apply("Daniel Radcliffe"), getActor.apply("Emma Watson"),
                                                        getActor.apply("Rupert Grint"))));
                        peliculas.add(crear("Harry Potter y las Reliquias de la Muerte 2",
                                        "La batalla final contra Voldemort.", 130, LocalDate.of(2011, 7, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoom3.jpg",
                                        getDirector.apply("David Yates"),
                                        List.of(getActor.apply("Daniel Radcliffe"), getActor.apply("Emma Watson"),
                                                        getActor.apply("Rupert Grint"))));
                        peliculas.add(crear("Star Wars: Una nueva esperanza", "Luke Skywalker descubre su destino.",
                                        121, LocalDate.of(1977, 5, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                                        getDirector.apply("George Lucas"),
                                        List.of(getActor.apply("Mark Hamill"), getActor.apply("Harrison Ford"),
                                                        getActor.apply("Carrie Fisher"))));
                        peliculas.add(crear("Star Wars: El Imperio contraataca",
                                        "Darth Vader revela un secreto impactante.", 124, LocalDate.of(1980, 5, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
                                        getDirector.apply("Irvin Kershner"),
                                        List.of(getActor.apply("Mark Hamill"), getActor.apply("Harrison Ford"),
                                                        getActor.apply("Carrie Fisher"))));
                        peliculas.add(crear("Star Wars: El Retorno del Jedi", "Luke enfrenta a Vader y al Emperador.",
                                        131, LocalDate.of(1983, 5, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg",
                                        getDirector.apply("Richard Marquand"),
                                        List.of(getActor.apply("Mark Hamill"), getActor.apply("Harrison Ford"),
                                                        getActor.apply("Carrie Fisher"))));
                        peliculas.add(crear("El Hobbit: Un viaje inesperado", "Bilbo se une a una compañía de enanos.",
                                        169, LocalDate.of(2012, 12, 14), 4,
                                        "https://image.tmdb.org/t/p/w500/yHA9Fc37VmpUA5UncTxxo3rTGVA.jpg",
                                        getDirector.apply("Peter Jackson"),
                                        List.of(getActor.apply("Martin Freeman"), getActor.apply("Ian McKellen"))));
                        peliculas.add(crear("Piratas del Caribe: La maldición del Perla Negra",
                                        "Jack Sparrow busca su barco.", 143, LocalDate.of(2003, 7, 9), 4,
                                        "https://image.tmdb.org/t/p/w500/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg",
                                        getDirector.apply("Gore Verbinski"),
                                        List.of(getActor.apply("Johnny Depp"), getActor.apply("Orlando Bloom"),
                                                        getActor.apply("Keira Knightley"))));

                        // 91-100: Más películas variadas
                        peliculas.add(crear("Django Unchained", "Un esclavo liberado busca a su esposa.", 165,
                                        LocalDate.of(2012, 12, 25), 5,
                                        "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Jamie Foxx"), getActor.apply("Christoph Waltz"),
                                                        getActor.apply("Leonardo DiCaprio"))));
                        peliculas.add(crear("Kill Bill: Volumen 1", "Una asesina busca venganza.", 111,
                                        LocalDate.of(2003, 10, 10), 5,
                                        "https://image.tmdb.org/t/p/w500/v7TKpFDqMz4dADKI1GNeXqAYpvk.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Uma Thurman"), getActor.apply("Lucy Liu"))));
                        peliculas.add(crear("Inglourious Basterds", "Un grupo de soldados judíos cazan nazis.", 153,
                                        LocalDate.of(2009, 8, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
                                        getDirector.apply("Quentin Tarantino"),
                                        List.of(getActor.apply("Brad Pitt"), getActor.apply("Christoph Waltz"),
                                                        getActor.apply("Michael Fassbender"))));
                        peliculas.add(crear("Jurassic Park", "Dinosaurios escapan en un parque temático.", 127,
                                        LocalDate.of(1993, 6, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/b1NyaHo8h5ZRQ3jiEDOrpsCseAo.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Sam Neill"), getActor.apply("Laura Dern"),
                                                        getActor.apply("Jeff Goldblum"))));
                        peliculas.add(crear("E.T. el extraterrestre", "Un niño ayuda a un alienígena a volver a casa.",
                                        115, LocalDate.of(1982, 6, 11), 5,
                                        "https://image.tmdb.org/t/p/w500/an0nD6uq6bLxj4eNrpBQVTqdO6j.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Henry Thomas"), getActor.apply("Drew Barrymore"))));
                        peliculas.add(crear("La lista de Schindler", "Un empresario salva a judíos del Holocausto.",
                                        195, LocalDate.of(1993, 12, 15), 5,
                                        "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Liam Neeson"), getActor.apply("Ben Kingsley"),
                                                        getActor.apply("Ralph Fiennes"))));
                        peliculas.add(crear("Salvar al soldado Ryan", "Una misión para rescatar a un paracaidista.",
                                        169, LocalDate.of(1998, 7, 24), 5,
                                        "https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IuATPZ9.jpg",
                                        getDirector.apply("Steven Spielberg"), List.of(getActor.apply("Tom Hanks"),
                                                        getActor.apply("Matt Damon"), getActor.apply("Tom Sizemore"))));
                        peliculas.add(crear("Regreso al futuro", "Un adolescente viaja al pasado en un DeLorean.", 116,
                                        LocalDate.of(1985, 7, 3), 5,
                                        "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
                                        getDirector.apply("Robert Zemeckis"), List.of(getActor.apply("Michael J. Fox"),
                                                        getActor.apply("Christopher Lloyd"))));
                        peliculas.add(crear("Indiana Jones: En busca del arca perdida",
                                        "Un arqueólogo busca el Arca de la Alianza.", 115, LocalDate.of(1981, 6, 12), 5,
                                        "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
                                        getDirector.apply("Steven Spielberg"),
                                        List.of(getActor.apply("Harrison Ford"), getActor.apply("Karen Allen"))));
                        peliculas.add(crear("Rocky", "Un boxeador tiene la oportunidad de su vida.", 120,
                                        LocalDate.of(1976, 11, 21), 5,
                                        "https://image.tmdb.org/t/p/w500/cqFzPD5S7mjpetCw1DWUWYj5ap.jpg",
                                        getDirector.apply("John G. Avildsen"),
                                        List.of(getActor.apply("Sylvester Stallone"), getActor.apply("Talia Shire"),
                                                        getActor.apply("Carl Weathers"))));

                        peliculaRepo.saveAll(peliculas);
                        System.out.println("✅ CATÁLOGO COMPLETO: " + peliculas.size() + " películas cargadas");
                };
        }

        private Pelicula crear(String titulo, String sinopsis, Integer duracion, LocalDate fecha, Integer valoracion,
                        String url, Director director, List<Actor> actoresList) {
                Pelicula p = new Pelicula();
                p.setTitulo(titulo);
                p.setSinopsis(sinopsis);
                p.setDuracion(duracion);
                p.setFechaEstreno(fecha);
                p.setValoracion(valoracion);
                p.setImagenUrl(url);
                p.setDirector(director);
                p.setActores(new ArrayList<>(actoresList));
                return p;
        }
}