package com.gestionPeliculas.web;

import com.gestionPeliculas.DTOs.PeliculaCreateUpdateDTO;
import com.gestionPeliculas.DTOs.PeliculaDTO;
import com.gestionPeliculas.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {
    private final PeliculaService service;

    @GetMapping
    public List<PeliculaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PeliculaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    /*
     * @GetMapping("/mejores_peliculas")
     * public List<Pelicula> mejores_peliculas() {
     * return service.mejores_peliculas();
     * }
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PeliculaDTO agregar(@Valid @RequestBody PeliculaCreateUpdateDTO pelicula) {
        return service.agregar(pelicula);
    }

    @PutMapping("/{id}")
    public PeliculaDTO actualizar(@PathVariable Long id, @Valid @RequestBody PeliculaCreateUpdateDTO pelicula) {
        return service.actualizar(id, pelicula);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @PatchMapping("/{id}/edad")
    public ResponseEntity<?> actualizarEdad(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
        Integer edadMinima = body.get("edadMinima");
        if (edadMinima == null) {
            return ResponseEntity.badRequest().body("edadMinima is required");
        }
        service.actualizarEdadMinima(id, edadMinima);
        return ResponseEntity.ok().build();
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
        // var t7 = service.tareaLenta2("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3, t4, t5, t6).join();

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
    @PostMapping("/cargarPeliculas/{nombreCarpeta}") // Creamos el endpoint para importar las peliculas
    public ResponseEntity<?> cargarPeliculasArchivo(@PathVariable String nombreCarpeta) throws IOException {
        String rutaFichero = "gestionPeliculas/src/main/resources/" + nombreCarpeta; // Pasamos por parametro la ruta de
                                                                                     // las peliculas

        service.importarCarpeta(rutaFichero); // Del servicePeliculas ejeutamos el importarCarpeta, con la ruta de la
                                              // carpeta por parametro para imprimir las peliculas que se han importado

        return ResponseEntity.status(HttpStatus.CREATED).body("Archivos importados correctamente");
    }

    // A4 - Ejercicio 4
    @GetMapping("/oscar/{jurados}") // Creamos el endpoint de los oscars
    public HashMap<String, Integer> votacionesOscars(@PathVariable int jurados) throws InterruptedException {
        return service.votacionOscars(jurados); // Devolvemos el metodo de service, pasando por parametro los jurados
                                                // que van a votar
    }

}
