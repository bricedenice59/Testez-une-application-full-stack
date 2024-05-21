package com.openclassrooms.starterjwt.api.integration.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final String email = "yoga@studio.com";
    private final String password = "test!1234";

    @Test
    @Order(1)
    @Tag("api/auth/register")
    @DisplayName("it should register the user")
    void AuthController_registerUser_ShouldReturnMessageResponse() throws Exception {
        SignupRequest signUpRequest = new SignupRequest();

        signUpRequest.setEmail(email);
        signUpRequest.setPassword(password);
        signUpRequest.setLastName("toto");
        signUpRequest.setFirstName("toto");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(signUpRequest);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    @Order(2)
    @Tag("api/auth/register")
    @DisplayName("it should fail to register a user who has already registered with a same email address")
    void AuthController_registerUser_Again_ShouldReturnBadRequestMessageResponse() throws Exception {
        SignupRequest signUpRequest = new SignupRequest();

        signUpRequest.setEmail(email);
        signUpRequest.setPassword(password);
        signUpRequest.setLastName("toto");
        signUpRequest.setFirstName("toto");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(signUpRequest);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    @Order(3)
    @Tag("api/auth/login")
    @DisplayName("it should login the user")
    void AuthController_loginUser_ShouldReturnIsOK() throws Exception {
        LoginRequest loginRequest = new LoginRequest();

        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(loginRequest);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.admin").exists());
    }
}
