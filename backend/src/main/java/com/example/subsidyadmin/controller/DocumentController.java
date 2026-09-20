package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.DocumentResponse;
import com.example.subsidyadmin.dto.DocumentUploadRequest;
import com.example.subsidyadmin.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> uploadDocument(@Valid @RequestBody DocumentUploadRequest request) {
        DocumentResponse uploaded = documentService.uploadDocument(request);
        return ResponseEntity.ok(uploaded);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable Long id) {
        DocumentResponse doc = documentService.getDocument(id);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<DocumentResponse>> listByApplication(@PathVariable Long applicationId) {
        List<DocumentResponse> docs = documentService.listDocumentsByApplication(applicationId);
        return ResponseEntity.ok(docs);
    }
}
