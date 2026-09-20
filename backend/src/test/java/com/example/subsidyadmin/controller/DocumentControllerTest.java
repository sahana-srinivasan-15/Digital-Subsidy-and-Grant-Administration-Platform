package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.DocumentUploadRequest;
import com.example.subsidyadmin.dto.DocumentResponse;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DocumentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private com.example.subsidyadmin.service.DocumentService documentService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private UserRepository userRepository;

    private DocumentResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new DocumentResponse();
        sampleResponse.setDocumentId(5L);
        sampleResponse.setFileName("doc.pdf");
        sampleResponse.setDocumentType("PDF");
    }

    @Test
    void testUploadDocument() throws Exception {
        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setApplicationId(1L);
        request.setFileName("doc.pdf");
        request.setDocumentType("PDF");
        request.setContent("base64string");

        Mockito.when(documentService.uploadDocument(any(DocumentUploadRequest.class)))
                .thenReturn(sampleResponse);

        mockMvc.perform(post("/api/documents/upload")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentId").value(5))
                .andExpect(jsonPath("$.fileName").value("doc.pdf"));
    }
}
