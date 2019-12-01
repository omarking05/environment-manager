import { HttpClientModule } from '@angular/common/http';
import { EnvironmentStoreService } from './../../../core/services/environment-store.service';
import { AvatarModule } from 'ngx-avatar';
import { EnvironmentService } from './../../../core/services/environment.service';
import { DatabaseService } from './../../../core/services/database.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentCardComponent } from './environment-card.component';

/** ANGULAR MATERIAL IMPORTS */
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
/** ANGULAR MATERIAL IMPORTS */


describe('EnvironmentCardComponent', () => {
  let component: EnvironmentCardComponent;
  let fixture: ComponentFixture<EnvironmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentCardComponent ],
      providers: [
        DatabaseService,
        EnvironmentService,
        EnvironmentStoreService
      ],
      imports: [
        /** MATERIAL MODULES */
        MatMenuModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        /** MATERIAL MODULES */

        AvatarModule,
        RouterTestingModule,
        HttpClientModule
      ]
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
