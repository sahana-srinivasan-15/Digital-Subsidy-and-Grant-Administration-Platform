package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
    List<Verification> findByApplicationApplicationId(Long applicationId);
    List<Verification> findByVerifierUserId(Long verifierId);
}
