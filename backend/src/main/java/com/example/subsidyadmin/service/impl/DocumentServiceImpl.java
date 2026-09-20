package com.example.subsidyadmin.service.impl;

import com.example.subsidyadmin.dto.DocumentResponse;
import com.example.subsidyadmin.dto.DocumentUploadRequest;
import com.example.subsidyadmin.exception.ResourceNotFoundException;
import com.example.subsidyadmin.model.Document;
import com.example.subsidyadmin.model.Application;
import com.example.subsidyadmin.repository.DocumentRepository;
import com.example.subsidyadmin.repository.ApplicationRepository;
import com.example.subsidyadmin.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, ApplicationRepository applicationRepository) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(DocumentUploadRequest request) {
        // Validate that the application exists
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + request.getApplicationId()));

        Document document = new Document();
        document.setApplication(application);
        document.setDocumentName(request.getDocumentType());
        document.setDocumentType(request.getDocumentType());
        document.setFileUrl(request.getFileName());
        document.setUploadedDate(LocalDateTime.now());
        document.setCreatedAt(LocalDateTime.now());
        document.setVerificationStatus("PENDING");

        Document saved = documentRepository.save(document);
        return toResponse(saved);
    }

    @Override
    public DocumentResponse getDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + documentId));
        return toResponse(document);
    }

    @Override
    public List<DocumentResponse> listDocumentsByApplication(Long applicationId) {
        List<Document> docs = documentRepository.findByApplicationApplicationId(applicationId);
        return docs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private DocumentResponse toResponse(Document doc) {
        DocumentResponse resp = new DocumentResponse();
        resp.setDocumentId(doc.getDocumentId());
        resp.setApplicationId(doc.getApplication().getApplicationId());
        resp.setDocType(doc.getDocumentType());
        resp.setUrl(doc.getFileUrl());
        resp.setUploadedAt(doc.getUploadedDate());
        return resp;
    }
}
