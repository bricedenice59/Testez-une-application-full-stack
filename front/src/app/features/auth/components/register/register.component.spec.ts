import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  const mockAuthService = {
    register: jest.fn(() => of(undefined))
  };

  const mockRouter = {
    navigate: (commands: any[], extras?: any, options?: any) => {},
  } as Router;

  beforeEach(async () => {
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
    const registerSpy = jest.spyOn(mockAuthService, 'register').mockImplementation(()=> of(undefined));
    const navigateSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    component.submit();

    expect(component.onError).toBe(false);
    expect(registerSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
