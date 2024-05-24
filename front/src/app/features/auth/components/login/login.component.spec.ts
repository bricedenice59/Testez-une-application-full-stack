import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {of, throwError} from "rxjs";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn(() => of({} as SessionInformation))
  };

  const mockSessionService = {
    logIn: jest.fn(() => of())
  };

  const mockRouter = {
    navigate: (commands: any[], extras?: any, options?: any) => {},
  } as Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should not log-in a user if credentials are incorrect or any other exception is caught (ex: internet connection down...)', () => {
    const loginSpy = jest.spyOn(mockAuthService, 'login').mockImplementation(() => throwError(() => {}));

    component.submit();
    fixture.detectChanges();

    expect(loginSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);

    const errorElement = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(errorElement.textContent).toEqual('An error occurred');
  });

  it('should log-in successfully a user if credentials are correct, fill the session with the correct user information and navigate to sessions page)', () => {
    const loginSpy = jest.spyOn(mockAuthService, 'login').mockImplementation(() => of({} as SessionInformation));
    const sessionServiceSpy = jest.spyOn(mockSessionService, 'logIn');
    const navigateSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    component.submit();

    expect(component.onError).toBe(false);
    expect(loginSpy).toHaveBeenCalled();
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
});
