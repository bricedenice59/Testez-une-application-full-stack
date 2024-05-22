package com.openclassrooms.starterjwt.api.integration.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Tag("api/teacher")
public class TeacherControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;


    private final int numberOfTeachers = 5;

    @BeforeAll
    public void setup() {
        var userEmail = "brice@denice.com";
        var userFirstname = "brice";
        var userLastName = "Denice";

        //create the default user for authentication purpose used in all here-below tests of this class
        var newDefaultuser = User.builder()
                .admin(true)
                .firstName(userFirstname)
                .lastName(userLastName)
                .email(userEmail)
                .password("bricedenice!1")
                .build();
        userRepository.save(newDefaultuser);

        //create a few teachers
        var lstTeachers = new ArrayList<Teacher>();
        for (var i = 1; i <= numberOfTeachers; i++) {
            lstTeachers.add(
                    Teacher.builder()
                            .firstName("teacher_firstname" + i)
                            .lastName("teacher_lastname" + i)
                            .build());
        }

        teacherRepository.saveAll(lstTeachers);
    }

    //region Test unauthorized endpoints

    @Test
    @Order(1)
    @DisplayName("it should fail to find a teacher when no authorization is provided")
    public void TeacherController_FindById_ShouldReturnUnauthorizedResponse() throws Exception {
        mockMvc.perform(get("/api/teacher/{id}", numberOfTeachers)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    @DisplayName("it should fail to find all teachers when no authorization is provided")
    public void TeacherController_FindAll_ShouldReturnUnauthorizedResponse() throws Exception {
        mockMvc.perform(delete("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    //endregion

    @Test
    @Order(3)
    @DisplayName("it should fail to find a teacher with an invalid formatted input user id")
    @WithUserDetails(value = "brice@denice.com")
    public void TeacherController_FindById_ShouldReturnBadRequestResponse() throws Exception {
        var teacherId = "aa"; //invalid teacher id

        mockMvc.perform(get("/api/teacher/{id}", teacherId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(4)
    @DisplayName("it should fail to find a teacher that has never been created")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindById_ShouldReturnNotFoundResponse() throws Exception {
        var teacherId = 100L; //teacher doesn't exist
        mockMvc.perform(get("/api/teacher/{id}", teacherId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(5)
    @DisplayName("it should successfully find a teacher by id")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindById_ShouldReturnOkResponse() throws Exception {
        var teacherId = 3L;
        mockMvc.perform(get("/api/teacher/{id}", teacherId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("teacher_firstname" + teacherId))
                .andExpect(jsonPath("$.lastName").value("teacher_lastname" + teacherId));
    }

    @Test
    @Order(6)
    @DisplayName("it should successfully retrieve a list of teachers previously created")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindAll_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", Matchers.hasSize(numberOfTeachers)));
    }
}
