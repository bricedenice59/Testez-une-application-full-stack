package com.openclassrooms.starterjwt.api.repository;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Tag("UserRepositoryTests")
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;


    @Test
    @DisplayName("Create a user in database and lookup user by email")
    public void UserRepository_findByEmail_ReturnsUser() {
        final String userEmail = "test@email.com";
        User user = User.builder()
                .email(userEmail)
                .password("password")
                .firstName("brice")
                .lastName("denice")
                .build();

        userRepository.save(user);
        Optional<User> userOptional = userRepository.findByEmail(userEmail);

        Assertions.assertTrue(userOptional.isPresent());
    }

    @Test
    @DisplayName("Create a user in database and ckeck if user can be retrieved by email")
    public void UserRepository_existsByEmail_ReturnsTrue() {
        final String userEmail = "brice@brice.com";
        User user = User.builder()
                .email(userEmail)
                .password("password")
                .firstName("brice")
                .lastName("denice")
                .build();

        userRepository.save(user);
        var isFound = userRepository.existsByEmail(userEmail);

        Assertions.assertTrue(isFound);
    }
}
