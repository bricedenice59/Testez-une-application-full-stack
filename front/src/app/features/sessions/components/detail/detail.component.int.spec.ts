import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule} from '@angular/material/snack-bar';
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

describe('DetailComponent Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: Partial<SessionService>;
  let mockSessionApiService: Partial<SessionApiService>;
  let mockTeacherService: Partial<TeacherService>;
  let mockActivatedRoute: any;
  let mockRouter: Partial<Router>;

  const session: Session = {
    name: '',
    description: '',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 3,
    users: [2]
  };

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
      }};

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(session)),
      delete: jest.fn().mockReturnValue(of(null)),
      participate: jest.fn().mockReturnValue(of(null)),
      unParticipate: jest.fn().mockReturnValue(of(null)),
    };

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of())
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    mockRouter = {
      navigate: jest.fn(),
    };

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

  it("should display a delete button if user is admin and can not participate/un-participate to a yoga session", () => {
    //in sessionInformation, user is already admin
    const deleteButton = fixture.nativeElement.querySelector('#deleteButton')
    expect(deleteButton).toBeTruthy();
  });

  it("should display a participate button if user is NOT admin and user has not yet participated to a yoga session", () => {
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();

    const participateButton = fixture.nativeElement.querySelector('#participateButton')
    expect(participateButton).toBeTruthy();
  });

  it("should display a un-participate button if user is NOT admin and user has already participated to a yoga session", () => {
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    const participateButton = fixture.nativeElement.querySelector('#participateButton')
    expect(participateButton).not.toBeTruthy();

    const unParticipateButton = fixture.nativeElement.querySelector('#unParticipateButton')
    expect(unParticipateButton).toBeTruthy();
  });

});

