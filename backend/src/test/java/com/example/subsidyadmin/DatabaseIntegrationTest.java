package com.example.subsidyadmin;

import com.example.subsidyadmin.model.*;
import com.example.subsidyadmin.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@DataJpaTest
@Rollback(false) // keep data for manual inspection if needed
public class DatabaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private SchemeRepository schemeRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private VerificationRepository verificationRepository;
    @Autowired
    private ApprovalRepository approvalRepository;
    @Autowired
    private FundRepository fundRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Test
    public void testEntityPersistenceAndRelations() {
        // 1. Role
        Role applicantRole = new Role();
        applicantRole.setRoleName("APPLICANT");
        roleRepository.save(applicantRole);

        // 2. User (applicant)
        User applicant = new User();
        applicant.setName("John Doe");
        applicant.setEmail("john.doe@example.com");
        applicant.setPassword("hashedpassword");
        applicant.setRole(applicantRole);
        applicant.setCreatedAt(LocalDateTime.now());
        userRepository.save(applicant);

        // 3. Scheme
        Scheme scheme = new Scheme();
        scheme.setSchemeName("Education Grant");
        scheme.setDescription("Support for higher education");
        scheme.setSchemeType("GRANT");
        scheme.setTotalFund(new BigDecimal("1000000"));
        scheme.setMaximumAmount(new BigDecimal("50000"));
        scheme.setStartDate(LocalDate.now().minusDays(1));
        scheme.setDeadline(LocalDate.now().plusMonths(1));
        scheme.setStatus("ACTIVE");
        scheme.setCreatedBy(applicant);
        scheme.setCreatedAt(LocalDateTime.now());
        schemeRepository.save(scheme);

        // 4. Application
        Application app = new Application();
        app.setApplicant(applicant);
        app.setScheme(scheme);
        app.setApplicationNumber("APP-001");
        app.setSubmittedDate(LocalDateTime.now());
        app.setRequestedAmount(new BigDecimal("30000"));
        app.setApplicationStatus("SUBMITTED");
        app.setCreatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        // 5. Verification
        Role verifierRole = new Role();
        verifierRole.setRoleName("VERIFIER");
        roleRepository.save(verifierRole);
        User verifier = new User();
        verifier.setName("Verifier One");
        verifier.setEmail("verifier@example.com");
        verifier.setPassword("hashedpwd");
        verifier.setRole(verifierRole);
        verifier.setCreatedAt(LocalDateTime.now());
        userRepository.save(verifier);

        Verification verification = new Verification();
        verification.setApplication(app);
        verification.setVerifier(verifier);
        verification.setVerificationStatus("PASSED");
        verification.setVerificationScore(new BigDecimal("85.5"));
        verification.setVerificationDate(LocalDateTime.now());
        verification.setCreatedAt(LocalDateTime.now());
        verificationRepository.save(verification);

        // 6. Approval
        Role authorityRole = new Role();
        authorityRole.setRoleName("AUTHORITY");
        roleRepository.save(authorityRole);
        User authority = new User();
        authority.setName("Authority A");
        authority.setEmail("authority@example.com");
        authority.setPassword("hashedpwd");
        authority.setRole(authorityRole);
        authority.setCreatedAt(LocalDateTime.now());
        userRepository.save(authority);

        Approval approval = new Approval();
        approval.setApplication(app);
        approval.setAuthority(authority);
        approval.setDecision("APPROVED");
        approval.setApprovedAmount(new BigDecimal("30000"));
        approval.setDecisionDate(LocalDateTime.now());
        approval.setCreatedAt(LocalDateTime.now());
        approvalRepository.save(approval);

        // 7. Fund (linked to scheme)
        Fund fund = new Fund();
        fund.setScheme(scheme);
        fund.setTotalAllocatedAmount(new BigDecimal("1000000"));
        fund.setTotalDistributedAmount(new BigDecimal("30000"));
        fundRepository.save(fund);

        // 8. Payment
        Payment payment = new Payment();
        payment.setApplication(app);
        payment.setApprovedAmount(new BigDecimal("30000"));
        payment.setPaymentStatus("COMPLETED");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId("TXN-12345");
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // 9. Notification
        Notification notif = new Notification();
        notif.setUser(applicant);
        notif.setTitle("Application Submitted");
        notif.setMessage("Your application APP-001 has been submitted.");
        notif.setNotificationType("APPLICATION");
        notif.setIsRead(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);

        // 10. Audit log entry
        AuditLog audit = new AuditLog();
        audit.setEntityType("Application");
        audit.setEntityId(app.getApplicationId());
        audit.setAction("CREATE");
        audit.setPerformedBy(applicant);
        audit.setPerformedAt(LocalDateTime.now());
        audit.setDetails("Application created via test");
        audit.setCreatedAt(LocalDateTime.now());
        auditLogRepository.save(audit);

        // ---- Assertions ----
        Assertions.assertNotNull(applicant.getUserId());
        Assertions.assertNotNull(scheme.getSchemeId());
        Assertions.assertNotNull(app.getApplicationId());
        Assertions.assertEquals("APPLICANT", applicant.getRole().getRoleName());
        Assertions.assertEquals("VERIFIER", verifier.getRole().getRoleName());
        Assertions.assertEquals("AUTHORITY", authority.getRole().getRoleName());
        Assertions.assertEquals("PASSED", verification.getVerificationStatus());
        Assertions.assertEquals("APPROVED", approval.getDecision());
        Assertions.assertEquals(new BigDecimal("30000"), fund.getTotalDistributedAmount());
        Assertions.assertEquals("COMPLETED", payment.getPaymentStatus());
        Assertions.assertFalse(notif.getIsRead());
        Assertions.assertEquals("CREATE", audit.getAction());
    }
}
