package com.gestionPeliculas.service;

import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.repository.PeliculaRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.scheduling.annotation.Async;

import java.util.Random;
import java.util.concurrent.CompletableFuture;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Semaphore;
import java.util.stream.Stream;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


@Service
@Getter
@RequiredArgsConstructor
public class PeliculaService {
    private final List<Pelicula> peliculas = new ArrayList<>();
    private final PeliculaRepository peliculaRepository;

/*
    public PeliculaService(PeliculaRepository peliculaRepository) {
        peliculas.add(new Pelicula(1L, "Interstellar", 169, LocalDate.of(2014, 11, 7),
                "Exploradores espaciales buscan un nuevo hogar para la humanidad.",6,null,null,null));
        peliculas.add(new Pelicula(2L, "The Dark Knight", 152, LocalDate.of(2008, 7, 18),
                "Batman enfrenta al Joker en una lucha por el alma de Gotham.",4,null,null,null));
        peliculas.add(new Pelicula(3L, "Soul", 100, LocalDate.of(2020, 12, 25),
                "Un músico descubre el sentido de la vida más allá de la muerte.",5,null,null,null));
    }

 */


    public List<Pelicula> mejores_peliculas(int valoracion){
        List<Pelicula> peliculas_aux= new ArrayList<>();
        for (Pelicula p : peliculas) {
            if (p.getValoracion()>=valoracion) {
                peliculas_aux.add(p);
            }
        }
        return peliculas_aux;
    }

    public List<Pelicula> listar() {
        return peliculas;
    }

    public Pelicula buscarPorId(Long id) {
        for (Pelicula p : peliculas) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
        /*
        * return peliculas.stream()                 // convierte la lista en un flujo de datos
        .filter(p -> p.getId().equals(id)) // se queda solo con las películas cuyo id coincide
        .findFirst()                       // toma la primera coincidencia (si existe)
        .orElse(null);                     // devuelve esa película o null si no hay
        * */
    }

    public void agregar(Pelicula pelicula) {
        peliculas.add(pelicula);
    }

    public String tareaLenta(String titulo) {
        try {
            System.out.println("Iniciando tarea para " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000); // simula proceso lento (3 segundos)
            System.out.println("Terminando tarea para " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "Procesada " + titulo;
    }

    @Async("taskExecutor")
    public CompletableFuture<String> tareaLenta2(String titulo) {
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    @Async("taskExecutor")
    public CompletableFuture<String> reproducir(String titulo) {
        try {
            System.out.println("Reproduciendo " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(importarCsvAsync(path));
                } else if (nombre.endsWith(".xml")) {
                    futures.add(importarXmlAsync(path));
                }
            });
        }
        // Esperar a que terminen todas las tareas asíncronas
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long fin = System.currentTimeMillis();
        System.out.println("Importación completa en " + (fin - inicio) + " ms");
    }


    @Async("taskExecutor")
    public CompletableFuture<Void> importarCsvAsync(Path fichero) {
        try {
            System.out.println("Procesando CSV: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            List<String> lineas = Files.readAllLines(fichero);
            lineas.remove(0); // suponemos encabezado

            for (String linea : lineas) {
                String[] campos = linea.split(";");
                Pelicula p = new Pelicula();
                p.setTitulo(campos[0]);
                p.setDuracion(Integer.parseInt(campos[1]));
                p.setFechaEstreno(LocalDate.parse(campos[2]));
                p.setSinopsis(campos[3]);
                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado CSV: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en CSV " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    @Async("taskExecutor")
    public CompletableFuture<Void> importarXmlAsync(Path fichero) {
        try {
            System.out.println("Procesando XML: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document doc = builder.parse(fichero.toFile());
            NodeList nodos = doc.getElementsByTagName("pelicula");

            for (int i = 0; i < nodos.getLength(); i++) {
                Element e = (Element) nodos.item(i);

                Pelicula p = new Pelicula();
                p.setTitulo(e.getElementsByTagName("titulo").item(0).getTextContent());
                p.setDuracion(Integer.parseInt(e.getElementsByTagName("duracion").item(0).getTextContent()));
                p.setFechaEstreno(LocalDate.parse(e.getElementsByTagName("fechaEstreno").item(0).getTextContent()));
                p.setSinopsis(e.getElementsByTagName("sinopsis").item(0).getTextContent());

                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado XML: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en XML " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }


    // Metodos para hacer el ejericicio 4

    private HashMap<String, Integer> votacion = new HashMap<>();
    Semaphore sem = new Semaphore(5);
    Random random = new Random();

    public HashMap<String, Integer> votacionOscars(int jurados) {
        long inicio =System.currentTimeMillis();

        votacion.clear();

        List<Pelicula> peliculas = peliculaRepository.findAll();

        System.out.println("Peliculas encontradas en la Base de Datos(BD): " + peliculas.size());
        for(Pelicula p : peliculas) {
            System.out.println(" - " + p.getTitulo());
        }

        List<String> titulosPeliculas = new ArrayList<>();

        for (Pelicula p : peliculas) {
            titulosPeliculas.add(p.getTitulo());
        }

        List<CompletableFuture<Void>> tareas = new ArrayList<>();

        for (int i = 0; i < jurados; i++) {
            tareas.add(votar(titulosPeliculas, i + 1));
        }

        CompletableFuture.allOf(tareas.toArray(new CompletableFuture[0])).join();

        System.out.println("Votaciones finalizadas.");
        System.out.println("Resultado: ");
        System.out.println(votacion);

        long fin = System.currentTimeMillis();

        long tiempoTotal = (fin - inicio);

        System.out.println("Las votaciones de las peliculas han durado " + tiempoTotal + " milisegundos");

        return votacion;
    }


    @Async("taskExecutor")
    public CompletableFuture<Void> votar(List<String> titulosCandidatas, int idJurado) {
        try {
            sem.acquire();
            try {
                for (String titulo : titulosCandidatas) {
                    int puntos = random.nextInt(11);
                    System.out.println("El jurado " + idJurado + " vota con " +  puntos + " puntos a " + titulo);

                    synchronized (votacion) {
                        votacion.put(titulo, votacion.getOrDefault(titulo, 0) + puntos);
                    }
                }

            } finally {
                sem.release();
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return CompletableFuture.completedFuture(null);
    }
}

