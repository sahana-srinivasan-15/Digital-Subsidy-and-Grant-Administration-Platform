package com.example.subsidyadmin.dto;

import java.time.LocalDateTime;

/**
 * DTO for returning document information.
 */
public class DocumentResponse {
    private Long documentId;
    private Long applicationId;
    private String docType;
    private String url;
    private LocalDateTime uploadedAt;

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    private String fileName;
    private String documentType;

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getDocType() { return docType != null ? docType : documentType; }
    public void setDocType(String docType) { this.docType = docType; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
