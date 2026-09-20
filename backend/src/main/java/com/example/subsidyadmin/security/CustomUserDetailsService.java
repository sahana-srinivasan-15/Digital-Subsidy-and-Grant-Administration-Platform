package com.example.subsidyadmin.security;

import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String cleanEmail = email != null ? email.trim() : "";
        User user = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (user == null) {
            user = userRepository.findByEmail(cleanEmail);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "APPLICANT";
        java.util.List<GrantedAuthority> authorities = new java.util.ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(roleName));
        if (!roleName.startsWith("ROLE_")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
