package com.openclassrooms.starterjwt.api.integration.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Tag("api/user")
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User user;

    private String userEmail;
    private String userFirstname;
    private String userLastName;

    @BeforeAll
    public void setup() {
        userEmail = "brice@denice.com";
        userFirstname = "brice";
        userLastName = "Denice";
        //create the default user for authentication purpose used in all here-below tests of this class
        var newDefaultuser = User.builder()
                .admin(true)
                .firstName(userFirstname)
                .lastName(userLastName)
                .email(userEmail)
                .password("bricedenice!1")
                .build();
        user = userRepository.save(newDefaultuser);
    }

    //region Test unauthorized endpoints

    @Test
    @Order(1)
    @DisplayName("it should fail to find a user when no authorization is provided")
    public void UserController_FindById_ShouldReturnUnauthorizedResponse() throws Exception {
        mockMvc.perform(get("/api/user/{id}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    @DisplayName("it should fail to delete a user when no authorization is provided")
    public void UserController_Delete_ShouldReturnUnauthorizedResponse() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    //endregion

    @Test
    @Order(3)
    @DisplayName("it should fail to find a user with an invalid formatted input user id")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindById_ShouldReturnBadRequestResponse() throws Exception {
        var userId = "aa"; //invalid user id

        mockMvc.perform(get("/api/user/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(4)
    @DisplayName("it should fail to find a user that has never been created")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindById_ShouldReturnNotFoundResponse() throws Exception {
        var userId = 100L; //user doesn't exist
        mockMvc.perform(get("/api/user/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(5)
    @DisplayName("it should find a user by id")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_FindById_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(get("/api/user/{id}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value(userFirstname))
                .andExpect(jsonPath("$.lastName").value(userLastName))
                .andExpect(jsonPath("$.email").value(userEmail));
    }

    @Test
    @Order(6)
    @DisplayName("it should fail to find a user with an invalid formatted input user id")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_Delete_ShouldReturnBadRequestResponse() throws Exception {
        var userId = "aa"; //invalid user id

        mockMvc.perform(delete("/api/user/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(7)
    @DisplayName("it should fail to delete a user that has never been created")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_Delete_ShouldReturnNotFoundResponse() throws Exception {
        var userId = 100L; //user doesn't exist
        mockMvc.perform(delete("/api/user/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(8)
    @DisplayName("it should successfully delete a user")
    @WithUserDetails(value = "brice@denice.com")
    public void UserController_Delete_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(delete("/api/user/{id}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
