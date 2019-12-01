import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnvironmentDialogComponent } from './add-environment-dialog.component';

/** ANGULAR MATERIAL IMPORTS */
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
/** ANGULAR MATERIAL IMPORTS */

describe('AddEnvironmentDialogComponent', () => {
  let component: AddEnvironmentDialogComponent;
  let fixture: ComponentFixture<AddEnvironmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEnvironmentDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // workaround: https://github.com/angular/components/issues/8419#issuecomment-359698681
        { provide: MAT_DIALOG_DATA, useValue: [] },
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

        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
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
