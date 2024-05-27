import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import {User} from "../../interfaces/user.interface";
import {of} from "rxjs";

import '@testing-library/jest-dom';

describe('MeComponent Integration Test', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockSessionService: Partial<SessionService>;
  let user: User;

  beforeEach(async () => {
    // Define the user object here if it's not going to change across tests
    user = {
      id: 1,
      email: 'yoga@user.com',
      password: 'none!',
      firstName: 'yoga',
      lastName: 'yoga',
      admin: true,
      createdAt: new Date('05/24/2024'),
    };

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
      logOut: jest.fn(() => of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    component.user = user;
    fixture.detectChanges();
  });

  it('should display a label(You are admin) if current user in session is admin ', () => {
    const adminLabel = fixture.nativeElement.querySelector('#adminLabel')
    expect(adminLabel).toBeTruthy();
    expect(adminLabel.textContent).toEqual('You are admin');
  });

  it("should display a label(Delete my account: ) and a delete button if the current user in session is not an admin", () => {
    user.admin = false;
    component.user = user;
    fixture.detectChanges();

    const deleteLabel = fixture.nativeElement.querySelector('#deleteLabel')
    expect(deleteLabel).toBeTruthy();
    expect(deleteLabel.textContent).toBe('Delete my account:');

    const deleteButton =  fixture.nativeElement.querySelector('#deleteButton')
    expect(deleteButton).toBeTruthy();
  });

});
