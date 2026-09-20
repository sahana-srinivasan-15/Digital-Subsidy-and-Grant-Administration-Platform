package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.PaymentRequest;
import com.example.subsidyadmin.dto.PaymentResponse;
import com.example.subsidyadmin.exception.BusinessException;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Application;
import com.example.subsidyadmin.model.Fund;
import com.example.subsidyadmin.model.Payment;
import com.example.subsidyadmin.repository.ApplicationRepository;
import com.example.subsidyadmin.repository.FundRepository;
import com.example.subsidyadmin.repository.PaymentRepository;
import com.example.subsidyadmin.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ApplicationRepository applicationRepository;
    private final FundRepository fundRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              ApplicationRepository applicationRepository,
                              FundRepository fundRepository) {
        this.paymentRepository = paymentRepository;
        this.applicationRepository = applicationRepository;
        this.fundRepository = fundRepository;
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + request.getApplicationId()));

        if (!"APPROVED".equalsIgnoreCase(application.getApplicationStatus())) {
            throw new BusinessException("Payment can only be processed for APPROVED applications.");
        }

        Payment payment = new Payment();
        payment.setApplication(application);
        payment.setApprovedAmount(request.getAmount());
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentStatus("COMPLETED");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setCreatedAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);

        // Update Fund distributed amount if fund exists for this scheme
        Fund fund = fundRepository.findBySchemeSchemeId(application.getScheme().getSchemeId());
        if (fund != null) {
            BigDecimal distributed = fund.getTotalDistributedAmount() != null ? fund.getTotalDistributedAmount() : BigDecimal.ZERO;
            fund.setTotalDistributedAmount(distributed.add(request.getAmount()));
            fund.setUpdatedAt(LocalDateTime.now());
            fundRepository.save(fund);
        }

        application.setApplicationStatus("DISBURSED");
        applicationRepository.save(application);

        return toResponse(saved);
    }

    @Override
    public PaymentResponse getPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + paymentId));
        return toResponse(payment);
    }

    @Override
    public List<PaymentResponse> listPaymentsByApplication(Long applicationId) {
        List<Payment> payments = paymentRepository.findByApplicationApplicationId(applicationId);
        return payments.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentResponse resp = new PaymentResponse();
        resp.setPaymentId(payment.getPaymentId());
        resp.setApplicationId(payment.getApplication().getApplicationId());
        resp.setTransactionId(payment.getTransactionId());
        resp.setAmount(payment.getApprovedAmount());
        resp.setStatus(payment.getPaymentStatus());
        resp.setPaidAt(payment.getPaymentDate());
        return resp;
    }
}
