import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnvironmentDialogComponent } from './add-environment-dialog.component';

describe('AddEnvironmentDialogComponent', () => {
  let component: AddEnvironmentDialogComponent;
  let fixture: ComponentFixture<AddEnvironmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEnvironmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEnvironmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
