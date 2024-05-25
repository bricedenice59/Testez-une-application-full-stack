import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {User} from "../interfaces/user.interface";

describe('UserService', () => {
  let service: UserService;
  let httpTestingControllerMock: HttpTestingController;
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpTestingControllerMock = TestBed.inject(HttpTestingController);

    mockUser = {
      id: 1,
      email: 'yoga@user.com',
      password: 'none!',
      firstName: 'yoga',
      lastName: 'yoga',
      admin: false,
      createdAt: new Date(),
    };
  });

  it('should create user service', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID', () => {
    const userId = '1';
    service.getById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete a user by ID', () => {
    const userId = '1';
    service.delete(userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
