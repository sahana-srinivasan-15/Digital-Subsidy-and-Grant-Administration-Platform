package com.example.subsidyadmin.controller;

import com.example.subsidyadmin.dto.NotificationResponse;
import com.example.subsidyadmin.model.Role;
import com.example.subsidyadmin.model.User;
import com.example.subsidyadmin.repository.UserRepository;
import com.example.subsidyadmin.security.CustomUserDetailsService;
import com.example.subsidyadmin.security.JwtTokenProvider;
import com.example.subsidyadmin.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = NotificationController.class, excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
        org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class,
        org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
        org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private com.example.subsidyadmin.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    private User citizenA;
    private User citizenB;
    private User adminUser;
    private UsernamePasswordAuthenticationToken authCitizenA;
    private UsernamePasswordAuthenticationToken authAdmin;

    @BeforeEach
    public void setup() {
        Role citizenRole = new Role();
        citizenRole.setRoleName("APPLICANT");

        Role adminRole = new Role();
        adminRole.setRoleName("ADMINISTRATOR");

        citizenA = new User();
        citizenA.setUserId(1L);
        citizenA.setName("Citizen A (Rahul Kumar)");
        citizenA.setEmail("citizena@gov.in");
        citizenA.setRole(citizenRole);

        citizenB = new User();
        citizenB.setUserId(2L);
        citizenB.setName("Citizen B (Kavitha Rao)");
        citizenB.setEmail("citizenb@gov.in");
        citizenB.setRole(citizenRole);

        adminUser = new User();
        adminUser.setUserId(99L);
        adminUser.setName("Admin Chief");
        adminUser.setEmail("admin@gov.in");
        adminUser.setRole(adminRole);

        authCitizenA = new UsernamePasswordAuthenticationToken(
                citizenA.getEmail(),
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_APPLICANT"))
        );

        authAdmin = new UsernamePasswordAuthenticationToken(
                adminUser.getEmail(),
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMINISTRATOR"))
        );

        Mockito.when(userRepository.findByEmail("citizena@gov.in")).thenReturn(citizenA);
        Mockito.when(userRepository.findByEmailIgnoreCase("citizena@gov.in")).thenReturn(citizenA);

        Mockito.when(userRepository.findByEmail("citizenb@gov.in")).thenReturn(citizenB);
        Mockito.when(userRepository.findByEmailIgnoreCase("citizenb@gov.in")).thenReturn(citizenB);

        Mockito.when(userRepository.findByEmail("admin@gov.in")).thenReturn(adminUser);
        Mockito.when(userRepository.findByEmailIgnoreCase("admin@gov.in")).thenReturn(adminUser);
    }

    @Test
    public void testGetMyNotifications_returnsOnlyAuthenticatedUserNotifications() throws Exception {
        NotificationResponse resp = new NotificationResponse();
        resp.setNotificationId(101L);
        resp.setUserId(citizenA.getUserId());
        resp.setUserEmail(citizenA.getEmail());
        resp.setTitle("Application Received");
        resp.setMessage("Personal application status update");
        resp.setIsRead(false);
        resp.setIsGlobal(false);
        resp.setCreatedAt(LocalDateTime.now());

        Mockito.when(notificationService.listNotificationsForAuthenticatedUser(1L))
                .thenReturn(List.of(resp));

        mockMvc.perform(get("/api/notifications")
                        .principal(authCitizenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationId").value(101))
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].userEmail").value("citizena@gov.in"))
                .andExpect(jsonPath("$[0].title").value("Application Received"));
    }

    @Test
    public void testGetUnreadCount_returnsAccurateCountForAuthenticatedUser() throws Exception {
        Mockito.when(notificationService.getUnreadCountForUser(1L)).thenReturn(3L);

        mockMvc.perform(get("/api/notifications/unread-count")
                        .principal(authCitizenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(3));
    }

    @Test
    public void testListByUser_sameUser_allowed() throws Exception {
        NotificationResponse resp = new NotificationResponse();
        resp.setNotificationId(101L);
        resp.setUserId(1L);

        Mockito.when(notificationService.listNotificationsByUser(1L)).thenReturn(List.of(resp));

        mockMvc.perform(get("/api/notifications/user/1")
                        .principal(authCitizenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationId").value(101));
    }

    @Test
    public void testListByUser_otherUser_forbidden() throws Exception {
        // Citizen A trying to read Citizen B's notifications (id = 2) must be rejected with 403 Forbidden
        mockMvc.perform(get("/api/notifications/user/2")
                        .principal(authCitizenA))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testListByUser_admin_allowed() throws Exception {
        NotificationResponse resp = new NotificationResponse();
        resp.setNotificationId(202L);
        resp.setUserId(2L);

        Mockito.when(notificationService.listNotificationsByUser(2L)).thenReturn(List.of(resp));

        // Admin can inspect other user's notifications
        mockMvc.perform(get("/api/notifications/user/2")
                        .principal(authAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationId").value(202));
    }

    @Test
    public void testMarkAsRead_unauthorizedUser_returnsForbidden() throws Exception {
        Mockito.doThrow(new AccessDeniedException("Access Denied: You are not authorized to modify notifications belonging to another account."))
                .when(notificationService).markAsRead(eq(202L), eq(1L), eq(false));

        mockMvc.perform(patch("/api/notifications/202/read")
                        .principal(authCitizenA))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testMarkAllAsRead_marksOnlyForAuthenticatedUser() throws Exception {
        mockMvc.perform(patch("/api/notifications/mark-all-read")
                        .principal(authCitizenA))
                .andExpect(status().isNoContent());

        Mockito.verify(notificationService, Mockito.times(1)).markAllAsReadForUser(1L);
    }
}
