package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.ApplicationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    List<ApplicationStatusHistory> findByApplicationApplicationId(Long applicationId);
    List<ApplicationStatusHistory> findByChangedByUserId(Long userId);
}
