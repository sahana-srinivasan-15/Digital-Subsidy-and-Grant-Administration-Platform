package com.example.subsidyadmin.repository;

import com.example.subsidyadmin.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Application findByApplicationNumber(String applicationNumber);
    java.util.List<Application> findByApplicantUserId(Long userId);
    boolean existsByApplicant_UserIdAndScheme_SchemeId(Long applicantId, Long schemeId);
    org.springframework.data.domain.Page<Application> findAllByApplicant_UserId(Long applicantId, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Application> findByApplicationStatus(String status, org.springframework.data.domain.Pageable pageable);
}
