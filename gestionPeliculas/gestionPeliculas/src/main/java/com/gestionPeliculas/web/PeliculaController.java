package com.gestionPeliculas.web;



import com.gestionPeliculas.domain.Pelicula;
import com.gestionPeliculas.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {
    private final PeliculaService service;

    @GetMapping
    public List<Pelicula> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Pelicula buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/peliculas_mejores")
    public List<Pelicula> mejores_peliculas() {
        return service.mejores_peliculas(5);
    }
    /*
        @GetMapping("/mejores_peliculas")
        public List<Pelicula> mejores_peliculas() {
            return service.mejores_peliculas();
        }
    */
    @PostMapping
    public void agregar(@RequestBody Pelicula pelicula) {
        service.agregar(pelicula);
    }

    @GetMapping("/procesar")
    public String procesarPeliculas() {
        long inicio = System.currentTimeMillis();
        service.tareaLenta("Interstellar");
        service.tareaLenta("The Dark Knight");
        service.tareaLenta("Soul");
        long fin = System.currentTimeMillis();
        return "Tiempo total: " + (fin - inicio) + " ms";
    }

    @GetMapping("/procesarAsync")
    public String procesarAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.tareaLenta2("🍿 Interstellar");
        var t2 = service.tareaLenta2("🦇 The Dark Knight");
        var t3 = service.tareaLenta2("🎵 Soul");
        var t4 = service.tareaLenta2("🎵 Soul");
        var t5 = service.tareaLenta2("🎵 Soul");
        var t6 = service.tareaLenta2("🎵 Soul");
        //var t7 = service.tareaLenta2("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3,t4,t5,t6).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

    // A4 - Ejercicio 2
    @GetMapping("/reproducir")
    public String reproducirAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.reproducir("🍿 Interstellar");
        var t2 = service.reproducir("🦇 The Dark Knight");
        var t3 = service.reproducir("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

    // A4 - Ejercicio 3

    @PostMapping("/importar")
    public ResponseEntity<String> importar(@RequestParam("file")MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo esta vacio");
        }

        String nombreArchivo = file.getOriginalFilename();

        try {
            Path rutaTemporal = Files.createTempFile("upload_", "_" + nombreArchivo);

            Files.copy(file.getInputStream(), rutaTemporal, StandardCopyOption.REPLACE_EXISTING);

            if (nombreArchivo != null && nombreArchivo.endsWith(".csv")) {
                service.importarCsvAsync(rutaTemporal);
                return ResponseEntity.status(HttpStatus.ACCEPTED)
                        .body("Archivo CSV recibido. Procesando en segundo plano...");
            } else if (nombreArchivo != null && nombreArchivo.endsWith(".xml")) {
                service.importarXmlAsync(rutaTemporal);
                return ResponseEntity.status(HttpStatus.ACCEPTED)
                        .body("Archivo XML recibido. Procesando en segundo plano...");
            } else {
                Files.deleteIfExists(rutaTemporal);
                return ResponseEntity.badRequest().body("Formato no soportado. Usa .csv o .xml");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al iniciar la implementacion " + e.getMessage());
        }
    }


}
