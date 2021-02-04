import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditroomDialogComponent } from './editroom-dialog.component';

describe('EditroomDialogComponent', () => {
  let component: EditroomDialogComponent;
  let fixture: ComponentFixture<EditroomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditroomDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditroomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
