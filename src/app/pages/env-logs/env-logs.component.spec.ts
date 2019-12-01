import { EnvironmentStoreService } from './../../core/services/environment-store.service';
import { DatabaseService } from './../../core/services/database.service';
import { SharedModule } from './../../shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvLogsComponent } from './env-logs.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../core/services';

describe('EnvLogsComponent', () => {
  let component: EnvLogsComponent;
  let fixture: ComponentFixture<EnvLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvLogsComponent ],
      providers: [
        DatabaseService,
        EnvironmentStoreService,
        EnvironmentService
      ],
      imports: [
        RouterTestingModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
