import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Session} from "../interfaces/session.interface";

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpTestingControllerMock: HttpTestingController;
  let mockSession: Session;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpTestingControllerMock = TestBed.inject(HttpTestingController);

    mockSession = {
      id: 1,
      name: 'yoga@user.com',
      date: new Date(),
      description: '',
      users: [1,2],
      teacher_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  it('should create session-api service', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    const mockSessions: Session[] = [{
      id: 1,
      name: 'yoga@user.com',
      date: new Date(),
      description: '',
      users: [1,2],
      teacher_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
        id: 2,
        name: 'yoga1@user.com',
        date: new Date(),
        description: '',
        users: [1,2],
        teacher_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    }];
    service.all().subscribe(sessions => {
      expect(sessions.length).toBe(mockSessions.length);
    });

    const req = httpTestingControllerMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should retrieve session details', () => {
    const sessionId = '1';
    service.detail(sessionId).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    const sessionId = '1';
    service.delete(sessionId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create successfully a session', () => {
    service.create(mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpTestingControllerMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should update a session', () => {
    const sessionId = '1';
    service.update(sessionId, mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${sessionId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should participate in a session', () => {
    const sessionId = '1';
    const userId = '1';
    service.participate(sessionId, userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should un-participate from a session', () => {
    const sessionId = '1';
    const userId = '1';
    service.unParticipate(sessionId, userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
