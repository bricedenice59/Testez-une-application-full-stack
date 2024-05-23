package com.openclassrooms.starterjwt.unit.security.jwt;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@SpringBootConfiguration
public class JwtUtilsTests {

    @Value("${application.security.jwt.jwtExpirationMs}")
    int expirationDelay;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JwtUtils jwtUtils;

    private final String email = "yoga@studio.com";
    private final String password = "test!1234";
    private final String firstName = "yoga_firstname";
    private final String lastName = "yoga_lastname";

    @BeforeEach
    void setUp() {
        //node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "63aad59352bb166442ecd9d64e77210dc6308b003e3bad9c4194f304546cf68c");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", expirationDelay);
    }

    @Test
    @DisplayName("Test generating JWT token")
    public void JwtUtilsTests_GenerateJWTToken_ShouldSuccessfullyProvideAJWTToken() {
        var userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username(email)
                .password(password)
                .lastName(lastName)
                .firstName(firstName)
                .build();

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    @DisplayName("Test Validate a JWT token successfully")
    public void JwtUtilsTests_validateJwtToken_ShouldBeAValidAndNotExpiredToken() {
        var userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username(email)
                .password(password)
                .lastName(lastName)
                .firstName(firstName)
                .build();

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        boolean isValid = jwtUtils.validateJwtToken(token);

        assertTrue(isValid);
    }

    @Test
    @DisplayName("Test Validate a JWT token that is already expired should not be a valid token")
    public void JwtUtilsTests_validateJwtToken_AlreadyExpired_ShouldNotBeAValidToken() {
        var userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username(email)
                .password(password)
                .lastName(lastName)
                .firstName(firstName)
                .build();

        var yesterday = new Date(System.currentTimeMillis()-24*60*60*1000);
        String expiredToken = Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(yesterday) //make it issued yesterday
                .expiration(new Date(yesterday.getTime() + 60*1000)) //make it expired yesterday + 1h
                .signWith(jwtUtils.getSignInKey())
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        assertFalse(isValid);
    }

    @Test
    @DisplayName("Test extract user name (claim) from jwt token")
    public void JwtUtilsTests_getUserNameFromJwtToken_ShouldExtractSuccessfullyUserNameFromJwtToken() {
        var userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username(email)
                .password(password)
                .lastName(lastName)
                .firstName(firstName)
                .build();

        var token = Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()  + 60*1000)) // expires in 1h
                .signWith(jwtUtils.getSignInKey())
                .compact();

        var username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals(email, username);
    }
}