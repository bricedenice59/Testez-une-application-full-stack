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

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    $isLogged: jest.fn(),
    logOut: jest.fn().mockReturnValue(of(null))
  }

  const mockRouter = {
    navigate: (commands: any[], extras?: any, options?: any) => {},
  } as Router;

  beforeEach(async () => {
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
    mockSessionService.$isLogged.mockReturnValue(loggedStatus);
    expect(appComponent.$isLogged()).toBe(loggedStatus);
  });

  it('should logout user successfully and navigate to the homepage or the root view', () => {
    const routeSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    appComponent.logout();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(routeSpy).toHaveBeenCalledWith(['']);
  });
});
