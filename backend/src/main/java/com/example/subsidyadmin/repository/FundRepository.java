package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Fund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FundRepository extends JpaRepository<Fund, Long> {
    Fund findBySchemeSchemeId(Long schemeId);
}
