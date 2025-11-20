package com.gestionPeliculas.service;

import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.repository.PeliculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

// Creamos la clase externa para que nos coja la decoracion Async al importar los archivos
@Service
public class AsyncService {

    // Usamos Autowired para que se inicialice con un valor sin tener que inicializarlo manualmente
    @Autowired
    private PeliculaRepository peliculaRepository;

    // Creamos el metodo de importar los archivos CSV
    // Usamos la decoracion Async para que coja los datos de dentro de la clase AsyncConfig
    @Async("taskExecutor")
    public CompletableFuture<Void> importarCsvAsync(Path fichero) {
        try {
            System.out.println("Procesando CSV: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>(); // Creamos una lista donde vamos a guardar las peliculas

            List<String> lineas = Files.readAllLines(fichero);
            lineas.remove(0); // suponemos encabezado

            // Creamos el for para anadir la informacion de la pelicula en la lista 'lista'
            for (String linea : lineas) {
                String[] campos = linea.split(";");
                Pelicula p = new Pelicula();
                p.setTitulo(campos[0]);
                p.setDuracion(Integer.parseInt(campos[1]));
                p.setFechaEstreno(LocalDate.parse(campos[2]));
                p.setSinopsis(campos[3]);
                lista.add(p);
            }

            peliculaRepository.saveAll(lista); // Guardamos la lista en el repositorio

            System.out.println("Finalizado CSV: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en CSV " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    // Usamos la decoracion Async para que coja los datos de dentro de la clase AsyncConfig
    // Creamos el metodo para importar los archivos XML
    @Async("taskExecutor")
    public CompletableFuture<Void> importarXmlAsync(Path fichero) {
        try {
            System.out.println("Procesando XML: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>(); // Creamos la lista 'lista'

            // Usamos DOM para leer el archivo xml
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document doc = builder.parse(fichero.toFile());
            NodeList nodos = doc.getElementsByTagName("pelicula");

            // Con el for recorremos el xml y lo anadimos a la lista
            for (int i = 0; i < nodos.getLength(); i++) {
                Element e = (Element) nodos.item(i);

                Pelicula p = new Pelicula();
                p.setTitulo(e.getElementsByTagName("titulo").item(0).getTextContent());
                p.setDuracion(Integer.parseInt(e.getElementsByTagName("duracion").item(0).getTextContent()));
                p.setFechaEstreno(LocalDate.parse(e.getElementsByTagName("fechaEstreno").item(0).getTextContent()));
                p.setSinopsis(e.getElementsByTagName("sinopsis").item(0).getTextContent());

                lista.add(p);
            }

            // Lo guardamos todo en el repositorio
            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado XML: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en XML " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    // Creamos el metodo para votar
    // Usamos la decoracion Async para que coja los datos de dentro de la clase AsyncConfig
    @Async("taskExecutor")
    public CompletableFuture<Void> votar(List<Pelicula> peliculasCandidatas, int idJurado, Semaphore sem, ConcurrentHashMap<String, Integer> votacion) {
        Random random = new Random(); // Creamos el random para que los votos sean random
        try {
            sem.acquire();
            try {
                // Elegimos la película de manera aleatoria, generar un número dentro del rango del tamaño del array
                Pelicula peliculaRandom = peliculasCandidatas.get(new Random().nextInt(peliculasCandidatas.size()));

                // Cremos la varible de los puntos para que voten los jurados
                int puntos = random.nextInt(11);

                System.out.println("El jurado " + idJurado + " (" + Thread.currentThread().getName() + " ) " + " vota con " +  puntos + " puntos a " + peliculaRandom.getTitulo());

                votacion.merge(peliculaRandom.getTitulo(), puntos, (a, b) -> a + b);


            } finally {
                sem.release();
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return CompletableFuture.completedFuture(null);
    }

}
