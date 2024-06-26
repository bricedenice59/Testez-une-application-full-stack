import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { Router, RouterOutlet} from "@angular/router";
import {SessionService} from "./services/session.service";
import {Observable, of} from "rxjs";


describe('AppComponent', () => {
  let appComponent: AppComponent;
  let mockSessionService: Partial<SessionService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1,
        firstName:'',
        lastName:'',
        type:'',
        username:'',
        token:''
      },
      $isLogged: jest.fn(),
      logOut: jest.fn().mockReturnValue(of(null))
    }
    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatToolbarModule,
        RouterOutlet,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should return logged in status', () => {
    const loggedStatus: Observable<boolean> = of(true);
    // @ts-ignore
    mockSessionService.$isLogged.mockReturnValue(loggedStatus);
    expect(appComponent.$isLogged()).toBe(loggedStatus);
  });

  it('should logout user successfully and navigate to the homepage or the root view', () => {
    appComponent.logout();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
