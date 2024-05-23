package com.openclassrooms.starterjwt.unit.security.jwt;

import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class AuthEntryPointJwtTests {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Test
    @DisplayName("Test commence method")
    void AuthEntryPointJwtTests_Commence_ShouldRespondWithUnauthorizedJsonMessage() throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        AuthenticationException authException = mock(AuthenticationException.class);
        when(authException.getMessage()).thenReturn("Unauthorized");

        authEntryPointJwt.commence(request, response, authException);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, response.getContentType());

        String actualBody = response.getContentAsString();
        assertEquals("{\"path\":\"\",\"error\":\"Unauthorized\",\"message\":\"Unauthorized\",\"status\":401}", actualBody);
    }
}
