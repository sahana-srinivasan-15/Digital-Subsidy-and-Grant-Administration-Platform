package com.example.subsidyadmin.config;

import com.example.subsidyadmin.model.*;
import com.example.subsidyadmin.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final FundRepository fundRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           SchemeRepository schemeRepository,
                           FundRepository fundRepository,
                           ApplicationRepository applicationRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
        this.fundRepository = fundRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Roles
        Role applicantRole = getOrCreateRole("APPLICANT");
        Role verifierRole = getOrCreateRole("VERIFIER");
        Role authorityRole = getOrCreateRole("AUTHORITY");
        Role adminRole = getOrCreateRole("ADMINISTRATOR");

        // 2. Seed Users with updated credentials
        User applicant = getOrCreateUser("applicant@gov.in", "Rahul Kumar", "password123", applicantRole, "+91 98765 43210", "Medak District, Telangana");
        User sahana = getOrCreateUser("sahana@gmail.com", "Sahana", "sahana$45", verifierRole, "+91 98765 11223", "Field Verification Directorate");
        User mayur = getOrCreateUser("mayur@gmail.com", "Mayur", "mayur%34", authorityRole, "+91 98765 44556", "State Grant Sanctioning Directorate");
        User sachin = getOrCreateUser("sachin@gmail.com", "Sachin", "sachin", adminRole, "+91 98765 99887", "Ministry of Digital Governance");
        User admin = sachin;
        User applicant2 = getOrCreateUser("kavitha.rao@enterprise.org", "Kavitha Rao", "password123", applicantRole, "+91 99120 44819", "Warangal District, Telangana");

        // 3. Seed Schemes
        Scheme kisan = getOrCreateScheme("PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
                new BigDecimal("6000.00"), new BigDecimal("60000000.00"), "AGRICULTURE", admin);

        Scheme awas = getOrCreateScheme("PMAY-G (Pradhan Mantri Awas Yojana - Gramin)",
                "Financial assistance for construction of pucca house with basic amenities to all rural houseless families.",
                new BigDecimal("120000.00"), new BigDecimal("150000000.00"), "HOUSING", admin);

        Scheme ayushman = getOrCreateScheme("PM-JAY (Ayushman Bharat Health Cover)",
                "Health protection coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
                new BigDecimal("500000.00"), new BigDecimal("200000000.00"), "HEALTHCARE", admin);

        Scheme scholarship = getOrCreateScheme("National Merit-cum-Means Scholarship",
                "Pre-matric and post-matric financial award for meritorious students from economically weaker sections.",
                new BigDecimal("48000.00"), new BigDecimal("35000000.00"), "EDUCATION", admin);

        Scheme pmegp = getOrCreateScheme("PMEGP (Prime Minister Employment Generation)",
                "Credit-linked subsidy program to generate self-employment opportunities through micro-enterprises.",
                new BigDecimal("500000.00"), new BigDecimal("80000000.00"), "MSME", admin);

        Scheme skill = getOrCreateScheme("PMKVY 4.0 (Pradhan Mantri Kaushal Vikas Yojana)",
                "Skill training certification with stipend and placement linkage in high-demand industry sectors.",
                new BigDecimal("25000.00"), new BigDecimal("25000000.00"), "SKILL DEVELOPMENT", admin);

        // 4. Seed Funds for Schemes
        seedFund(kisan, new BigDecimal("60000000.00"), new BigDecimal("12000000.00"));
        seedFund(awas, new BigDecimal("150000000.00"), new BigDecimal("45000000.00"));
        seedFund(ayushman, new BigDecimal("200000000.00"), new BigDecimal("60000000.00"));
        seedFund(scholarship, new BigDecimal("35000000.00"), new BigDecimal("14000000.00"));
        seedFund(pmegp, new BigDecimal("80000000.00"), new BigDecimal("28000000.00"));
        seedFund(skill, new BigDecimal("25000000.00"), new BigDecimal("9000000.00"));

        // 5. Seed Initial Sample Applications
        if (applicationRepository.count() == 0) {
            seedApplication(applicant, kisan, "APP-2026-1001", new BigDecimal("6000.00"), "UNDER_VERIFICATION");
            seedApplication(applicant, awas, "APP-2026-1002", new BigDecimal("120000.00"), "VERIFIED");
            seedApplication(applicant, scholarship, "APP-2026-1003", new BigDecimal("48000.00"), "APPROVED");
        }

        // 6. Seed Account-Specific Notifications (Strictly isolated per account)
        if (notificationRepository.count() == 0) {
            // Citizen A (Rahul Kumar)
            createAccountNotification(applicant, "Application Received",
                    "Your application APP-2026-1024 for Agriculture Machinery Subsidy was successfully registered.", "INFO");
            createAccountNotification(applicant, "Documents Scrutiny Update",
                    "Your land records for PM-KISAN have been queued for district verification.", "SUCCESS");

            // Citizen B (Kavitha Rao - Same role APPLICANT, completely separate account)
            createAccountNotification(applicant2, "MSME Application Registered",
                    "Your Women Entrepreneurship Seed Capital Subsidy application APP-2026-1028 was recorded.", "SUCCESS");

            // Field Verifier (Anil Sharma)
            createAccountNotification(verifier, "New Verification Queue Assignment",
                    "Application APP-2026-1024 has been assigned to your district field verification queue.", "WARNING");

            // Sanction Officer (Dr. Priya Varma)
            createAccountNotification(authority, "Sanction Approval Pending",
                    "Application APP-2026-1025 has been verified by Inspector Anil Sharma and is awaiting sanction approval.", "SUCCESS");

            // Chief Admin Officer
            createAccountNotification(admin, "Monthly Fund Utilization Alert",
                    "PM-KISAN scheme has disbursed 56% allocated treasury budget for Q3.", "INFO");
        }
    }

    private void createAccountNotification(User user, String title, String message, String type) {
        if (user == null) return;
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setNotificationType(type);
        n.setIsRead(false);
        n.setIsGlobal(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    private Role getOrCreateRole(String roleName) {
        Role role = roleRepository.findByRoleName(roleName);
        if (role == null) {
            role = new Role();
            role.setRoleName(roleName);
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            role = roleRepository.save(role);
        }
        return role;
    }

    private User getOrCreateUser(String email, String name, String rawPassword, Role role, String phone, String address) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setPhone(phone);
            user.setAddress(address);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user = userRepository.save(user);
        } else {
            user.setName(name);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setUpdatedAt(LocalDateTime.now());
            user = userRepository.save(user);
        }
        return user;
    }

    private Scheme getOrCreateScheme(String name, String desc, BigDecimal maxAmt, BigDecimal totalFund, String type, User createdBy) {
        Scheme scheme = schemeRepository.findAll().stream()
                .filter(s -> s.getSchemeName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
        if (scheme == null) {
            scheme = new Scheme();
            scheme.setSchemeName(name);
            scheme.setDescription(desc);
            scheme.setMaximumAmount(maxAmt);
            scheme.setTotalFund(totalFund);
            scheme.setSchemeType(type);
            scheme.setStatus("ACTIVE");
            scheme.setStartDate(LocalDate.now().minusMonths(1));
            scheme.setDeadline(LocalDate.now().plusMonths(11));
            scheme.setCreatedBy(createdBy);
            scheme.setCreatedAt(LocalDateTime.now());
            scheme.setUpdatedAt(LocalDateTime.now());
            scheme = schemeRepository.save(scheme);
        }
        return scheme;
    }

    private void seedFund(Scheme scheme, BigDecimal allocated, BigDecimal distributed) {
        if (fundRepository.findBySchemeSchemeId(scheme.getSchemeId()) == null) {
            Fund f = new Fund();
            f.setScheme(scheme);
            f.setTotalAllocatedAmount(allocated);
            f.setTotalDistributedAmount(distributed);
            f.setUpdatedAt(LocalDateTime.now());
            fundRepository.save(f);
        }
    }

    private void seedApplication(User applicant, Scheme scheme, String appNumber, BigDecimal amount, String status) {
        Application app = new Application();
        app.setApplicant(applicant);
        app.setScheme(scheme);
        app.setApplicationNumber(appNumber);
        app.setRequestedAmount(amount);
        app.setApplicationStatus(status);
        app.setSubmittedDate(LocalDateTime.now().minusDays(2));
        app.setCreatedAt(LocalDateTime.now().minusDays(2));
        app.setUpdatedAt(LocalDateTime.now().minusDays(1));
        applicationRepository.save(app);
    }
}
