-- Updated schema adding verification_score column to verifications
ALTER TABLE verifications ADD COLUMN verification_score DECIMAL(10,2) NULL AFTER verification_status;
