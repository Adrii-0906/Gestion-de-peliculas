package com.gestionPeliculas.DTOs.mappers;

import com.gestionPeliculas.DTOs.FuncionDTO;
import com.gestionPeliculas.DTOs.FunctionCreateUpdateDTO;
import com.gestionPeliculas.domain.Funcion;
import org.springframework.stereotype.Component;

@Component
public class FuncionMapper {

    public FuncionDTO toDto(Funcion funcion) {
        if (funcion == null) {
            return null;
        }

        return new FuncionDTO(
                funcion.getId(),
                funcion.getFecha(),
                funcion.getHora(),
                funcion.getPrecio(),
                funcion.getFormato()
        );
    }

    public Funcion toEntity(FunctionCreateUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        Funcion funcion = new Funcion();
        funcion.setFecha(dto.getFecha());
        funcion.setHora(dto.getHora());
        funcion.setPrecio(dto.getPrecio());
        funcion.setFormato(dto.getFormato());
        return funcion;
    }

    public void updateEntity(FunctionCreateUpdateDTO dto, Funcion funcion) {
        if (dto == null || funcion == null) {
            return;
        }
        funcion.setFecha(dto.getFecha());
        funcion.setHora(dto.getHora());
        funcion.setPrecio(dto.getPrecio());
        funcion.setFormato(dto.getFormato());
    }

}
