import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  let mockRouter: Partial<Router>;
  let mockAuthService : Partial<AuthService>;
  let mockSessionService : Partial<SessionService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(() => of({} as SessionInformation))
    };

    mockSessionService = {
      logIn: jest.fn(() => of())
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
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

  it('should log-in successfully a user if credentials are correct and navigate to sessions page)', () => {
    component.submit();

    expect(component.onError).toBe(false);
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockSessionService.logIn).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set an email and a password in form control', () => {
    const inputEmail = fixture.nativeElement.querySelector('[formControlName="email"]');
    const inputPassword = fixture.nativeElement.querySelector('[formControlName="password"]');

    expect(inputEmail).toBeTruthy();
    expect(inputPassword).toBeTruthy();

    inputEmail.value = 'yoga@user.com';
    inputEmail.dispatchEvent(new Event('input'));

    inputPassword.value = 'password!';
    inputPassword.dispatchEvent(new Event('input'));

    expect(component.form.value.email).toEqual('yoga@user.com');
    expect(component.form.value.password).toEqual('password!');
  });
});
