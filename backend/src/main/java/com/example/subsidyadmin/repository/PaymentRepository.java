package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByApplicationApplicationId(Long applicationId);
    List<Payment> findByTransactionId(String transactionId);
}
