package com.openclassrooms.starterjwt.api.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.User;
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
import java.util.Arrays;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Tag("api/session")
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private String sessionName;
    private Long sessionId;
    private User user;
    private User anotherUser;

    @BeforeAll
    public void setup() {
        sessionId = 1L;
        sessionName = "Session 1";

        //create the default user for authentication purpose used in all here-below tests of this class
        var newDefaultuser = User.builder()
                .admin(true)
                .firstName("Brice")
                .lastName("Denice")
                .email("brice@denice.com")
                .password("bricedenice!1")
                .build();
        var newUser = User.builder()
                .admin(true)
                .firstName("AnotherBrice")
                .lastName("AnotherDenice")
                .email("amotherbrice@denice.com")
                .password("bricedenice!1")
                .build();
        user = userRepository.save(newDefaultuser);
        anotherUser = userRepository.save(newUser);
    }

    //region Test unauthorized endpoints

    @Test
    @DisplayName("it should fail to create a session when no authorization is provided")
    public void UserController_Create_ShouldReturnUnauthorizedResponse() throws Exception {
        var sessionDto = SessionDto.builder()
                .id(sessionId)
                .name(sessionName)
                .build();

        var objectMapper = new ObjectMapper();
        var json = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(post("/api/session", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("it should fail to find a session when no authorization is provided")
    public void SessionController_FindById_ShouldReturnUnAuthorizedResponse() throws Exception {
        mockMvc.perform(get("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("it should fail to find all session when no authorization is provided")
    public void SessionController_FindAll_ShouldReturnUnAuthorizedResponse() throws Exception {
        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("it should fail to update a session when no authorization is provided")
    public void SessionController_Update_ShouldReturnUnAuthorizedResponse() throws Exception {
        var sessionDto = SessionDto.builder()
                .id(sessionId)
                .name(sessionName)
                .build();

        var objectMapper = new ObjectMapper();
        var json = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(post("/api/session/{id}", sessionDto)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("it should fail to participate(add a user) to a session when no authorization is provided")
    public void SessionController_Participate_ShouldReturnUnAuthorizedResponse() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("it should fail to no longer participate(delete a user) from a session when no authorization is provided")
    public void SessionController_NoLongerParticipate_ShouldReturnUnAuthorizedResponse() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("it should fail to delete a session when no authorization is provided")
    public void SessionController_DeleteSession_ShouldReturnUnAuthorizedResponse() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    //endregion

    @Test
    @Order(1)
    @DisplayName("it should successfully create a session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Create_ShouldReturnOkResponse() throws Exception {
        var description = "Description Session 1";

        var sessionDto = SessionDto.builder()
                .id(sessionId)
                .name(sessionName)
                .date(new Date())
                .description(description)
                .teacher_id(1L)
                .users(new ArrayList<>())
                .build();

        var objectMapper = new ObjectMapper();
        var json = objectMapper.writeValueAsString(sessionDto);

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.name").value(sessionName))
                .andExpect(jsonPath("$.description").value(description))
                .andExpect(jsonPath("$.date").exists());
    }

    @Test
    @Order(2)
    @DisplayName("it should successfully find an existing session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_FindById_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(get("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.name").value(sessionName));

    }

    @Test
    @Order(3)
    @DisplayName("it should successfully update an existing session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Update_ShouldReturnOkResponse() throws Exception {
        var updatedSessionName = "Updated Session 1";
        var updatedSessionDescription = "Updated Description 1";
        var lstUsers = Arrays.asList(user.getId());
        var sessionDto = SessionDto.builder()
                .id(sessionId)
                .name(updatedSessionName)
                .date(new Date())
                .description(updatedSessionDescription)
                .teacher_id(1L)
                .users(lstUsers)
                .build();

        mockMvc.perform(put("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.name").value(updatedSessionName))
                .andExpect(jsonPath("$.description").value(updatedSessionDescription))
                .andExpect(jsonPath("$.users", Matchers.hasSize(lstUsers.size())))
                .andExpect(jsonPath("$.updatedAt").isNotEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("it should fail to update a session with an invalid formatted input session id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Update_ShouldReturnBadRequestResponse() throws Exception {
        var sessionId = "aa"; //invalid id
        var sessionDto = SessionDto.builder()
                .name("test fail update")
                .date(new Date())
                .description("description fail update")
                .teacher_id(1L)
                .build();

        mockMvc.perform(put("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(sessionDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(6)
    @DisplayName("it should fail to find a session that has never been created")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_FindById_ShouldReturnNotFoundResponse() throws Exception {
        long sessionId = 99L;

        mockMvc.perform(get("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(7)
    @DisplayName("it should fail to find a session with an invalid formatted input session id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_FindById_ShouldReturnBadRequestResponse() throws Exception {
        var sessionId = "aa"; //invalid id

        mockMvc.perform(get("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(8)
    @DisplayName("it should successfully return all created session before this test")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_FindAll_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(sessionId));
    }


    @Test
    @Order(9)
    @DisplayName("it should fail to participate to a session for an invalid formatted input user id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Participate_WithInvalidUserId_ShouldReturnBadRequestResponse() throws Exception {
        var userId = "toto";
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(10)
    @DisplayName("it should fail to participate to a session for an invalid formatted input session id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Participate_WithInvalidIds_ShouldReturnBadRequestResponse() throws Exception {
        var sessionId = "session";
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(11)
    @DisplayName("it should fail to participate to a session for an unknown user")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Participate_WithUnknownUserId_ShouldReturnNotFoundResponse() throws Exception {
        Long userId = 33L; //this user does not exist
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(12)
    @DisplayName("it should fail to participate to a session because the user has already participated")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_UserAlreadyParticipate_ShouldReturnBadRequestResponse() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(13)
    @DisplayName("it should participate(add a user) to a session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_Participate_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, anotherUser.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @Order(14)
    @DisplayName("it should fail to no longer participate(delete user) to a session for an invalid formatted input user id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_NoLongerParticipate_WithInvalidUserId_ShouldReturnBadRequestResponse() throws Exception {
        var userId = "toto";
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(15)
    @DisplayName("it should fail to no longer participate(delete user) to a session for an invalid formatted input session id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_NoLongerParticipate_WithInvalidIds_ShouldReturnBadRequestResponse() throws Exception {
        var sessionId = "session";
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(16)
    @DisplayName("it should fail to no longer participate(delete user) from a non existing session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_NoLongerParticipate_WithUnknownSessionId_ShouldReturnNotFoundResponse() throws Exception {
        var sessionId = 3L;
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(17)
    @DisplayName("it should successfully no longer participate(delete user) from an existing session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_NoLongerParticipate_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, 2L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @Order(18)
    @DisplayName("it should fail to delete a session for an invalid formatted input session id")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_DeleteSession_WithInvalidSessionId_ShouldReturnBadRequestResponse() throws Exception {
        var sessionId = "toto";
        mockMvc.perform(delete("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(19)
    @DisplayName("it should fail to delete a non existing session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_DeleteSession_WithNotExistingSessionId_ShouldReturnNotFoundResponse() throws Exception {
        var sessionId = 3L;
        mockMvc.perform(delete("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(20)
    @DisplayName("it should successfully delete a session")
    @WithUserDetails(value = "brice@denice.com")
    public void SessionController_DeleteSession_ShouldReturnOkResponse() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
