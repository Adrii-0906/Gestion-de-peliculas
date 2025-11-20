package com.gestionPeliculas.service;

import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.repository.PeliculaRepository;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.stream.Stream;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


@Service
@Getter
public class PeliculaService {
    private final List<Pelicula> peliculas = new ArrayList<>();

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private AsyncService asyncService;

    public PeliculaService() {
        peliculas.add(new Pelicula(1L, "Interstellar", 169, LocalDate.of(2014, 11, 7),
                "Exploradores espaciales buscan un nuevo hogar para la humanidad.",6,null,null,null));
        peliculas.add(new Pelicula(2L, "The Dark Knight", 152, LocalDate.of(2008, 7, 18),
                "Batman enfrenta al Joker en una lucha por el alma de Gotham.",4,null,null,null));
        peliculas.add(new Pelicula(3L, "Soul", 100, LocalDate.of(2020, 12, 25),
                "Un músico descubre el sentido de la vida más allá de la muerte.",5,null,null,null));
    }



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
        return peliculaRepository.findAll();
    }

    public Pelicula buscarPorId(Long id) {
        for (Pelicula p : listar()) {
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
            long inicio = System.currentTimeMillis();
            System.out.println("Reproduciendo " + titulo + " en " + Thread.currentThread().getName());
            int milisegundosAleatorios = (new Random().nextInt(5)+1) * 1000; // Genera número aleatorio entre 1 y 5(por eso el +1 para quitar el 0)
            Thread.sleep(milisegundosAleatorios);
            long tiempoTotalReproduccion = System.currentTimeMillis() - inicio;
            System.out.println("Procesada la película: " + titulo + " en " + tiempoTotalReproduccion + " milisegundos");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    // A4 - Ejercicio 3
    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(asyncService.importarCsvAsync(path)); // Esto lo cambiamos para cogerlo de otra clase y que nos coja el Async
                } else if (nombre.endsWith(".xml")) {
                    futures.add(asyncService.importarXmlAsync(path)); // Esto lo cambiamos para cogerlo de otra clase y que nos coja el async
                }
            });
        }
        // Esperar a que terminen todas las tareas asíncronas
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long fin = System.currentTimeMillis();
        System.out.println("Importación completa en " + (fin - inicio) + " ms");
    }



    // A4 - Ejericicio 4
    // Creamos el metodo de la votacion
    public HashMap<String, Integer> votacionOscars(int jurados) {
        ConcurrentHashMap<String, Integer> votacion = new ConcurrentHashMap<>(); // Creamoa la votacion
        Semaphore sem = new Semaphore(5); // Con semaphore hacemos que solo puedan votar 5 a la vez

        long inicio = System.currentTimeMillis();

        List<Pelicula> peliculas = listar(); // Cogemos las peliculas


        for (Pelicula p : peliculas) {
            votacion.put(p.getTitulo(), 0);
        }

        List<CompletableFuture<Void>> tareas = new ArrayList<>(); // Creamos la lista de tareas

        for (int i = 0; i < jurados; i++) {
            tareas.add(asyncService.votar(peliculas, i + 1, sem, votacion)); // Recorremos los jurados con el for y anadimos en tareas las votaciones, cogemos el metodo votar de otra clase para que funcione la concurrencia
        }

        CompletableFuture.allOf(tareas.toArray(new CompletableFuture[0])).join(); // Paramos las votaciones


        // Sacamos los resultados
        System.out.println("Votaciones finalizadas.");
        System.out.println("Resultado: ");
        System.out.println(votacion);

        long fin = System.currentTimeMillis();

        long tiempoTotal = (fin - inicio); // Calculamos el tiempo total de la votacion

        System.out.println("Las votaciones de las peliculas han durado " + tiempoTotal + " milisegundos");

        return new HashMap<>(votacion);
    }
}

