package com.openclassrooms.starterjwt.api.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session mockedSession;

    @BeforeEach
    void setUp() {
        var teacher = Teacher.builder()
                .id(1L)
                .lastName("")
                .firstName("")
                .createdAt(LocalDateTime.now())
                .build();

        List<User> lstUsers = new ArrayList<>();
        for (long i = 1L; i <= 3L; i++) {
            lstUsers.add(
                User.builder()
                    .id(i)
                    .email("")
                    .firstName("")
                    .lastName("")
                    .admin(false)
                    .build()
            );
        }

        mockedSession = Session.builder()
                .id(1L)
                .name("Session1")
                .date(new Date())
                .description("Description Session1")
                .teacher(teacher)
                .users(lstUsers)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Test Create a new session")
    public void SessionService_CreateSession_ReturnsSavedSession() {
        when(sessionRepository.save(mockedSession)).thenReturn(mockedSession);

        Session result = sessionService.create(mockedSession);

        verify(sessionRepository).save(mockedSession);
        assertEquals(mockedSession, result);
    }

    @Test
    @DisplayName("Test Delete an existing session")
    public void SessionService_DeleteSession_ReturnsSavedSession() {
        doNothing().when(sessionRepository).deleteById(mockedSession.getId());

        sessionService.delete(mockedSession.getId());

        verify(sessionRepository).deleteById(mockedSession.getId());
    }

    @Test
    @DisplayName("Test Find All sessions")
    public void SessionService_FindAll_ReturnsAllSessions() {
        List<Session> allSessions = new ArrayList<>();
        allSessions.add(mockedSession);
        allSessions.add(mockedSession);

        when(sessionRepository.findAll()).thenReturn(allSessions);

        List<Session> result = sessionService.findAll();

        verify(sessionRepository).findAll();
        assertEquals(allSessions.size(), result.size());
    }

    @Test
    @DisplayName("Test Get session by Id")
    public void SessionService_GetById_ReturnsExistingSession() {
        when(sessionRepository.findById(mockedSession.getId())).thenReturn(Optional.of(mockedSession));

        Session result = sessionService.getById(mockedSession.getId());

        verify(sessionRepository).findById(mockedSession.getId());
        assertEquals(mockedSession, result);
    }

    @Test
    @DisplayName("Test Update a Session")
    public void SessionService_UpdateSession_ReturnsUpdatedSession() {
        mockedSession.setId(2L);
        when(sessionRepository.save(mockedSession)).thenReturn(mockedSession);

        Session result = sessionService.update(mockedSession.getId(), mockedSession);

        verify(sessionRepository).save(mockedSession);
        assertEquals(mockedSession, result);
    }

    @Test
    @DisplayName("Test Participate in a Session")
    public void SessionService_Participate_ShouldAddUserToSession() {
        Long sessionId = 1L;
        Long userId = 10L;
        var user = User.builder()
                .id(userId)
                .email("")
                .firstName("")
                .lastName("")
                .admin(false)
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockedSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        sessionService.participate(sessionId, userId);

        verify(sessionRepository).findById(sessionId);
        verify(userRepository).findById(userId);

        var userInSessions = mockedSession.getUsers();
        var isUserInSession = userInSessions.stream().anyMatch(x-> Objects.equals(x.getId(), user.getId()));
        assertTrue(isUserInSession);
    }

    @Test
    @DisplayName("Test Participate with a not defined session should throw a NotFoundException")
    public void SessionService_ParticipateWithUnknownSession_ShouldThrowNotFoundException() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> sessionService.participate(mockedSession.getId(), userId),
                "Expected participate() to throw NotFoundException, but it didn't"
        );
    }

    @Test
    @DisplayName("Test Participate with a not defined user in session should throw a NotFoundException")
    public void SessionService_ParticipateWithUnknownUser_ShouldThrowNotFoundException() {
        Long userId = 2L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> sessionService.participate(mockedSession.getId(), userId),
                "Expected participate() to throw NotFoundException, but it didn't"
        );
    }

    @Test
    @DisplayName("Test Participate with an existing same user in session should throw a BadRequestException")
    public void SessionService_ParticipateAgainWithSameUser_ShouldThrowException() {
        Long sessionId = 1L;
        Long userId = 2L; //already existing in mockedSession (check setUp())
        var user = User.builder()
                .id(userId)
                .email("")
                .firstName("")
                .lastName("")
                .admin(false)
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockedSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(
                BadRequestException.class,
                () -> sessionService.participate(mockedSession.getId(), userId),
                "Expected participate() to throw BadRequestException, but it didn't"
        );
    }

    @Test
    @DisplayName("Test NoLongerParticipate with a not defined session should throw a NotFoundException")
    public void SessionService_NoLongerParticipateWithUnknownSession_ShouldThrowNotFoundException() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> sessionService.noLongerParticipate(mockedSession.getId(), userId),
                "Expected participate() to throw NotFoundException, but it didn't"
        );
    }

    @Test
    @DisplayName("Test NoLongerParticipate to a Session")
    public void SessionService_NoLongerParticipate_ShouldRemoveUserFromSession() {
        Long sessionId = 1L;
        Long userId = 99L;

        var user = User.builder()
                .id(userId)
                .email("")
                .firstName("")
                .lastName("")
                .admin(false)
                .build();

        mockedSession.getUsers().add(user);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockedSession));
        when(sessionRepository.save(mockedSession)).thenReturn(mockedSession);

        sessionService.noLongerParticipate(sessionId, userId);

        verify(sessionRepository).findById(sessionId);

        var userInSessions = mockedSession.getUsers();
        var isUserInSession = userInSessions.stream().anyMatch(x-> Objects.equals(x.getId(), user.getId()));
        assertFalse(isUserInSession);
    }

    @Test
    @DisplayName("Test NoLongerParticipate with a user who does not participate in the current session should throw a BadRequestException")
    public void SessionService_NoLongerParticipate_Again_ShouldThrowException() {
        Long sessionId = 1L;
        Long userId = 10L; //that user does not exist in mockedSession (check setUp())

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockedSession));

        assertThrows(
                BadRequestException.class,
                () -> sessionService.noLongerParticipate(mockedSession.getId(), userId),
                "Expected NoLongerParticipate() to throw BadRequestException, but it didn't"
        );
    }

}
