import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { expect } from '@jest/globals';
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {SessionInformation} from "../../../interfaces/sessionInformation.interface";
import {LoginRequest} from "../interfaces/loginRequest.interface";

describe('AuthService', () => {
  let mockAuthService: AuthService;
  let HttpTestingControllerMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    mockAuthService = TestBed.inject(AuthService);
    HttpTestingControllerMock = TestBed.inject(HttpTestingController);
  });

  it('authentication service should be created', () => {
    expect(mockAuthService).toBeTruthy();
  });

  it('should send a POST request to register', () => {
    const registerRequest = {
      email: 'yoga@user.com',
      password: 'none!',
      firstName: 'yoga',
      lastName: 'yoga',
    };

    const register$ = mockAuthService.register(registerRequest);
    register$.subscribe({
      next: (data : void) : void => {
      },
      error: () => {
        console.log('Failed to register')
      }
    });

    const req = HttpTestingControllerMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest);
    req.flush(null);
  });

  it('should send a POST request to login', () => {
    const loginRequest: LoginRequest = {
      email: 'yoga@user.com',
      password: 'none!'
    };

    // This should be the expected response structure from server
    // after a successful login, which might include a session token and user details.
    const expectedResponse: SessionInformation = {
      token: '',
      type:'',
      id: 1,
      username: 'yoga@user.com',
      firstName: '',
      lastName: '',
      admin: false
    };

    mockAuthService.login(loginRequest).subscribe((response: SessionInformation) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = HttpTestingControllerMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(null);
  });
});
