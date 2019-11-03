import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentCardComponent } from './environment-card.component';

describe('EnvironmentCardComponent', () => {
  let component: EnvironmentCardComponent;
  let fixture: ComponentFixture<EnvironmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
