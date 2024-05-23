package com.openclassrooms.starterjwt.unit.security.services;


import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private final String email = "yoga@studio.com";

    @Test
    @DisplayName("Test loadUserByUsername with a valid username should successfully return a UserDetails object")
    public void UserDetailsServiceImplTest_loadUserByUsername_ReturnsUserDetails() {
        String password = "test!1234";
        String firstName = "yoga_firstname";
        String lastName = "yoga_lastname";

        User user = User.builder()
                .id(1L)
                .email(email)
                .password(password)
                .firstName(firstName)
                .lastName(lastName)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals(password, userDetails.getPassword());
        assertEquals(lastName, ((UserDetailsImpl) userDetails).getLastName());
        assertEquals(firstName, ((UserDetailsImpl) userDetails).getFirstName());
    }

    @Test
    @DisplayName("Test loadUserByUsername with a non existing username should throw a UsernameNotFoundException")
    public void UserDetailsServiceImplTest_loadUserByUsername_WithNonExistingUsername_ShouldThrowUsernameNotFoundException() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email));
    }
}
