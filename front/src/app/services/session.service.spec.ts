import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService', () => {
  let service: SessionService;
  const session: SessionInformation = {
    token: '',
    type:'',
    id: 1,
    username: 'yoga@user.com',
    firstName: '',
    lastName: '',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should create the session service', () => {
    expect(service).toBeTruthy();
  });

  it('should by default not be logged-in', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should update isLogged and sessionInformation variables on logIn', () => {
    service.logIn(session);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(session);
  });

  it('should update isLogged and sessionInformation variables on logOut', () => {
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit the correct value for $isLogged', () => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(service.isLogged);
    });

    service.logIn(session);
    expect(service.isLogged).toBe(true);
  });
});
