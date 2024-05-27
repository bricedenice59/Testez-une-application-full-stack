import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import {of, throwError} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService : Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(() => of(undefined))
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('it should not register a user if any exception is caught', () => {
    const registerSpy = jest.spyOn(mockAuthService, 'register').mockImplementation(() => throwError(() => {}));

    component.submit();
    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);

    const errorElement = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(errorElement.textContent).toEqual('An error occurred');
  });

  it('should register successfully a user and navigate to the login page)', () => {
    component.submit();

    expect(component.onError).toBe(false);
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fill all the inputs necessary for registering a new user in form control', () => {
    const inputFirstname = fixture.nativeElement.querySelector('[formControlName="firstName"]');
    const inputLastname = fixture.nativeElement.querySelector('[formControlName="lastName"]');
    const inputEmail = fixture.nativeElement.querySelector('[formControlName="email"]');
    const inputPassword = fixture.nativeElement.querySelector('[formControlName="password"]');

    expect(inputFirstname).toBeTruthy();
    expect(inputLastname).toBeTruthy();
    expect(inputEmail).toBeTruthy();
    expect(inputPassword).toBeTruthy();

    inputFirstname.value = 'yoga_firstname';
    inputFirstname.dispatchEvent(new Event('input'));

    inputLastname.value = 'yoga_lastname';
    inputLastname.dispatchEvent(new Event('input'));

    inputEmail.value = 'yoga@user.com';
    inputEmail.dispatchEvent(new Event('input'));

    inputPassword.value = 'password!';
    inputPassword.dispatchEvent(new Event('input'));

    expect(component.form.value.firstName).toEqual('yoga_firstname');
    expect(component.form.value.lastName).toEqual('yoga_lastname');
    expect(component.form.value.email).toEqual('yoga@user.com');
    expect(component.form.value.password).toEqual('password!');
  });
});
