import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import {TeacherService} from "../../../../services/teacher.service";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {SessionApiService} from "../../services/session-api.service";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {Session} from "../../interfaces/session.interface";

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const session: Session = {
    name: '',
    description: '',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 3,
    users: [1]
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(session)),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of())
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  const mockRouter = {
    navigate: (commands: any[], extras?: any, options?: any) => {},
  } as Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a session on component initialization', () => {
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
  });

  it('should delete session and navigate on delete()', () => {
    const snackBarOpenSpy = jest.spyOn(TestBed.inject(MatSnackBar), 'open').mockImplementation();
    const routeSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(routeSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate and fetch session on participate()', () => {
    const teacherDetailSpy = jest.spyOn(mockTeacherService, 'detail').mockImplementation();

    component.participate();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith(component.sessionId, component.userId);
    expect(teacherDetailSpy).toHaveBeenCalled();
  });

  it('should call unParticipate and fetch session on unParticipate()', () => {
    const teacherDetailSpy = jest.spyOn(mockTeacherService, 'detail').mockImplementation();

    component.unParticipate();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(component.sessionId, component.userId);
    expect(teacherDetailSpy).toHaveBeenCalled();
  });

  it('should go back', () => {
    const back = jest.spyOn(window.history, 'back');

    component.back();

    expect(back).toHaveBeenCalled();
  });
});

