import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import {Teacher} from "../interfaces/teacher.interface";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingControllerMock: HttpTestingController;
  let mockTeachers: Teacher[];
  let mockTeacher: Teacher;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpTestingControllerMock = TestBed.inject(HttpTestingController);

    mockTeachers = [
      {
        id: 1,
        lastName: 'yoga',
        firstName: 'yoga',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        lastName: 'yoga1',
        firstName: 'yoga1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    mockTeacher = {
      id: 1,
      lastName: 'yoga',
      firstName: 'yoga',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  it('should create teacher service', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all teachers', () => {
    service.all().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpTestingControllerMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should retrieve teacher details', () => {
    const teacherId = '1';
    service.detail(teacherId).subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpTestingControllerMock.expectOne(`${service['pathService']}/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });

});
