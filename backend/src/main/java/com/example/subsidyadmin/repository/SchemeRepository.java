package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    Scheme findBySchemeName(String schemeName);
}
