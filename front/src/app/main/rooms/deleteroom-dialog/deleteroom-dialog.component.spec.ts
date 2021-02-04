import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteroomDialogComponent } from './deleteroom-dialog.component';

describe('DeleteroomDialogComponent', () => {
  let component: DeleteroomDialogComponent;
  let fixture: ComponentFixture<DeleteroomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteroomDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteroomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
