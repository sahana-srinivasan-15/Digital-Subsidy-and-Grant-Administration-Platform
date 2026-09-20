-- Full database schema for Digital Subsidy & Grant Administration Platform

-- Roles table
CREATE TABLE roles (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Users table
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- Schemes table
CREATE TABLE schemes (
    scheme_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_amount DECIMAL(15,2) NOT NULL,
    status ENUM('ACTIVE','INACTIVE') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
) ENGINE=InnoDB;
CREATE INDEX idx_scheme_status ON schemes(status);

-- Applications table
CREATE TABLE applications (
    application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    requested_amount DECIMAL(15,2) NOT NULL,
    status ENUM('DRAFT','SUBMITTED','VERIFIED','APPROVED','REJECTED') NOT NULL,
    submitted_at DATETIME NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES users(user_id),
    CONSTRAINT fk_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id),
    CONSTRAINT uq_applicant_scheme UNIQUE (applicant_id, scheme_id)
) ENGINE=InnoDB;
CREATE INDEX idx_application_status ON applications(status);

-- Documents table
CREATE TABLE documents (
    document_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_document_application FOREIGN KEY (application_id) REFERENCES applications(application_id)
) ENGINE=InnoDB;

-- Verifications table
CREATE TABLE verifications (
    verification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    verifier_id BIGINT NOT NULL,
    remarks TEXT,
    score INT,
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_verification_application FOREIGN KEY (application_id) REFERENCES applications(application_id),
    CONSTRAINT fk_verification_verifier FOREIGN KEY (verifier_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Approvals table
CREATE TABLE approvals (
    approval_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    authority_id BIGINT NOT NULL,
    status ENUM('APPROVED','REJECTED') NOT NULL,
    approved_amount DECIMAL(15,2) NULL,
    remarks TEXT,
    approved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_approval_application FOREIGN KEY (application_id) REFERENCES applications(application_id),
    CONSTRAINT fk_approval_authority FOREIGN KEY (authority_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Funds table
CREATE TABLE funds (
    fund_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_fund_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
) ENGINE=InnoDB;

-- Payments table
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    application_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING','COMPLETED','FAILED') NOT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_payment_application FOREIGN KEY (application_id) REFERENCES applications(application_id)
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Application status history table
CREATE TABLE application_status_history (
    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT NOT NULL,
    CONSTRAINT fk_status_history_application FOREIGN KEY (application_id) REFERENCES applications(application_id),
    CONSTRAINT fk_status_history_user FOREIGN KEY (changed_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Audit logs table (existing)
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by BIGINT NOT NULL,
    performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_audit_performed_by FOREIGN KEY (performed_by) REFERENCES users(user_id)
) ENGINE=InnoDB;
