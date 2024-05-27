import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import {of} from "rxjs";
import {Session} from "../../interfaces/session.interface";
import {SessionApiService} from "../../services/session-api.service";
import {ActivatedRoute, RouterLink} from "@angular/router";

describe('ListComponent Integration Test', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: Partial<SessionService>;
  let mockSessionApiService: Partial<SessionApiService>;

  const mockSessions: Session[] = [{
    id: 1,
    name: 'yoga@user.com',
    date: new Date(),
    description: '',
    users: [1,2],
    teacher_id: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
    {
      id: 2,
      name: 'yoga1@user.com',
      date: new Date(),
      description: '',
      users: [1,2],
      teacher_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }];

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
      }
    };

    mockSessionApiService= {
      all: jest.fn().mockReturnValue(of(mockSessions))
    }

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterLink
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: null }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should display a create button if user is admin", () => {
    //in sessionInformation, user is already admin
    const createButton = fixture.nativeElement.querySelector('#createButton')
    expect(createButton).toBeTruthy();
  });

  it("should display a edit button if user is admin", () => {
    //in sessionInformation, user is already admin
    const editButton = fixture.nativeElement.querySelector('#editButton')
    expect(editButton).toBeTruthy();
  });

  it("should NOT display a edit/create button if user is NOT an admin", () => {
    mockSessionService.sessionInformation!.admin = false;

    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector('#createButton')
    expect(createButton).not.toBeTruthy();

    const editButton = fixture.nativeElement.querySelector('#editButton')
    expect(editButton).not.toBeTruthy();
  });

});
