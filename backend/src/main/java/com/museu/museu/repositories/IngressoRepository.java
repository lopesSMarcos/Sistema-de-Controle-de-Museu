package com.museu.museu.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.museu.museu.domain.Ingresso;

public interface IngressoRepository extends JpaRepository<Ingresso, Integer> {
    
}
