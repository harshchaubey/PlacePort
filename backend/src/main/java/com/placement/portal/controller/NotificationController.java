package com.placement.portal.controller;

import com.placement.portal.dto.NotificationResponseDTO;
import com.placement.portal.entity.Notification;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.NotificationRepository;
import com.placement.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<NotificationResponseDTO> notifications = notificationRepository
                .findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream()
                .map(NotificationResponseDTO::from)
                .toList();

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        // Ensure the notification belongs to this user
        String email = authentication.getName();
        if (!notification.getStudent().getEmail().equals(email)) {
             return ResponseEntity.status(403).build();
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }
}
