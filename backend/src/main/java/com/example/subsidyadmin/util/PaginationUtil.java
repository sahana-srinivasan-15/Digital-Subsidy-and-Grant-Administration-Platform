package com.example.subsidyadmin.util;

import com.example.subsidyadmin.exception.BusinessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class PaginationUtil {

    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    public static Pageable createPageable(int page, int size) {
        if (size > MAX_PAGE_SIZE) {
            throw new BusinessException("Page size cannot exceed maximum limit of " + MAX_PAGE_SIZE);
        }
        int effectiveSize = size <= 0 ? DEFAULT_PAGE_SIZE : size;
        int effectivePage = Math.max(page, 0);
        return PageRequest.of(effectivePage, effectiveSize);
    }
}
