package com.openclassrooms.starterjwt.api.integration.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.event.annotation.BeforeTestClass;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
public abstract class BaseIT {

    @Autowired
    protected MockMvc mockMvc;

    protected final UserRepository userRepository;

    @BeforeTestClass
    public void setUp() {

    }

    @Autowired
    public BaseIT(UserRepository userRepository) {
        this.userRepository = userRepository;

        if(userRepository.existsByEmail(userEmail)) {
            user = userRepository.findByEmail(userEmail).orElse(null);
            return;
        }

        //create the default user for authentication purpose used in all here-below tests of this class
        var newDefaultuser = User.builder()
                .admin(true)
                .firstName(userFirstname)
                .lastName(userLastname)
                .email(userEmail)
                .password("bricedenice!1")
                .build();
        user = userRepository.save(newDefaultuser);
    }

    protected User user;
    protected final String userEmail = "brice@denice.com";
    protected final String userFirstname = "brice";
    protected final String userLastname = "Denice";

}
