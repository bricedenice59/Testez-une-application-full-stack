package com.openclassrooms.starterjwt.unit.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTests {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    @DisplayName("Find all teachers")
    public void TeacherService_FindAll_ReturnsAllTeachers() {

        List<Teacher> lstTeachersInput = new ArrayList<>();
        for (long i = 1L; i <= 5L; i++) {
            lstTeachersInput.add(
                    Teacher.builder()
                        .id(i)
                        .lastName("")
                        .firstName("")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
            );
        }
        when(teacherRepository.findAll()).thenReturn(lstTeachersInput);

        List<Teacher> lstTeachersResult = teacherService.findAll();

        verify(teacherRepository).findAll();
        assertEquals(lstTeachersInput.size(), lstTeachersResult.size());
    }

    @Test
    @DisplayName("Find a teacher by ID succeeds")
    public void TeacherService_FindById_ReturnsExistingTeacher() {
        Long teacherId = 1L;
        var teacher = Teacher.builder()
                .id(teacherId)
                .lastName("")
                .firstName("")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(teacherId);

        verify(teacherRepository).findById(teacherId);
        assertEquals(teacher, result);
    }

    @Test
    @DisplayName("Find a teacher by ID fails")
    public void TeacherService_FindById_ReturnsNoTeacher() {
        Long teacherId = 1L;

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(teacherId);

        verify(teacherRepository).findById(teacherId);
        assertNull(result);
    }
}
