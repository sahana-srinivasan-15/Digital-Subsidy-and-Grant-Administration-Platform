package com.example.subsidyadmin.service;

import com.example.subsidyadmin.dto.DocumentResponse;
import com.example.subsidyadmin.dto.DocumentUploadRequest;

import java.util.List;

public interface DocumentService {
    /**
     * Upload a document for an application.
     */
    DocumentResponse uploadDocument(DocumentUploadRequest request);

    /**
     * Get a document by its ID.
     */
    DocumentResponse getDocument(Long documentId);

    /**
     * List all documents for a given application.
     */
    List<DocumentResponse> listDocumentsByApplication(Long applicationId);
}
