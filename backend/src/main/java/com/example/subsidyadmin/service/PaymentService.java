package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.PaymentRequest;
import com.example.subsidyadmin.dto.PaymentResponse;
import java.util.List;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPayment(Long paymentId);
    List<PaymentResponse> listPaymentsByApplication(Long applicationId);
}
