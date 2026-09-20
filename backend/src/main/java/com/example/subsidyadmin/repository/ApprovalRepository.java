package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByApplicationApplicationId(Long applicationId);
    List<Approval> findByAuthorityUserId(Long authorityId);
}
