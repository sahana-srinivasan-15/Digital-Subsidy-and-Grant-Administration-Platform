package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.SchemeCreateRequest;
import com.example.subsidyadmin.dto.SchemeResponse;
import com.example.subsidyadmin.service.SchemeService;
import com.example.subsidyadmin.util.PaginationUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    @Autowired
    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<SchemeResponse> createScheme(@Valid @RequestBody SchemeCreateRequest request) {
        SchemeResponse created = schemeService.createScheme(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getScheme(@PathVariable Long id) {
        SchemeResponse scheme = schemeService.getSchemeById(id);
        return ResponseEntity.ok(scheme);
    }

    @GetMapping
    public ResponseEntity<Page<SchemeResponse>> listSchemes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PaginationUtil.createPageable(page, size);
        Page<SchemeResponse> schemes = schemeService.listSchemes(pageable);
        return ResponseEntity.ok(schemes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<SchemeResponse> updateScheme(@PathVariable Long id, @Valid @RequestBody SchemeCreateRequest request) {
        SchemeResponse updated = schemeService.updateScheme(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> deactivateScheme(@PathVariable Long id) {
        schemeService.deactivateScheme(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/remove")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> removeScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.noContent().build();
    }
}
