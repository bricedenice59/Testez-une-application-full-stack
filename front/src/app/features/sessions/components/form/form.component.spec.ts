import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import {ActivatedRoute, Router} from "@angular/router";
import {TeacherService} from "../../../../services/teacher.service";
import {of} from "rxjs";
import {Teacher} from "../../../../interfaces/teacher.interface";
import {Session} from "../../interfaces/session.interface";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockFormBuilder: FormBuilder;

  const teachersMock: Teacher[] = [{
    id: 1,
    lastName: 'teacher1_name',
    firstName: 'teacher1_firstname',
    createdAt: new Date(),
    updatedAt: new Date()
  },
    {
    id: 2,
    lastName: 'teacher2_name',
    firstName: 'teacher2_firstname',
    createdAt: new Date(),
    updatedAt: new Date()
  }];

  const session: Session = {
    name: 'none',
    description: '',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 1,
    users: [1]
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of(teachersMock)),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  const mockRouter = {
    navigate: (commands: any[], extras?: any, options?: any) => {},
    url: '/this_page'
  } as Router;

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(session)),
    create: jest.fn().mockReturnValue(of(session)),
    update: jest.fn().mockReturnValue(of(session))
  };


  beforeEach(async () => {
    mockFormBuilder = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FormBuilder, useValue: mockFormBuilder }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize teachers$', () => {
    expect(component.teachers$).toEqual(mockTeacherService.all());
  });

  it('should redirect any non-admin user to /sessions page', () => {
    const routeSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    mockSessionService.sessionInformation!.admin = false;

    component.ngOnInit();

    expect(routeSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize a form with session data only when URL includes "update" ', () => {
    const updateUrl = '/update';
    Object.defineProperty(mockRouter, 'url', { get: () => updateUrl }); //because url fct is readonly, that's the way to set url in mock again

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should submit a new session with a form correctly filled be redirected to the sessions page', () => {
    const snackBarOpenSpy = jest.spyOn(TestBed.inject(MatSnackBar), 'open').mockImplementation();
    const routeSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    component.onUpdate = false;
    component.sessionForm = mockFormBuilder.group({
      name: ['Yoga session 26-05-2024', [Validators.required]],
      date: [new Date(), [Validators.required]],
      teacher_id: [1, [Validators.required]],
      description: ['Relaxing yoga session of Sunday', [Validators.required, Validators.max(2000)]]
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(routeSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should update an existing session and be redirected to the sessions page', () => {
    const snackBarOpenSpy = jest.spyOn(TestBed.inject(MatSnackBar), 'open').mockImplementation();
    const routeSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation(async () => true);

    component.onUpdate = true;
    component.sessionForm = mockFormBuilder.group({
      name: ['Yoga session 27-05-2024', [Validators.required]],
      date: [new Date(), [Validators.required]],
      teacher_id: ['1', [Validators.required]],
      description: ['Relaxing yoga session of Monday', [Validators.required, Validators.max(2000)]]
    });
    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalled();
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(routeSpy).toHaveBeenCalledWith(['sessions']);
  });
});
