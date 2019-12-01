import { EnvironmentCardComponent } from './components/environment-card/environment-card.component';
import { AddEnvironmentDialogComponent } from './components/add-environment-dialog/add-environment-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** ANGULAR MATERIAL IMPORTS */
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
/** ANGULAR MATERIAL IMPORTS */

import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [AddEnvironmentDialogComponent, EnvironmentCardComponent, WebviewDirective],
  imports: [
    /** MATERIAL MODULES */
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    /** MATERIAL MODULES */

    ReactiveFormsModule,
    AvatarModule,
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    EnvironmentCardComponent,
    AddEnvironmentDialogComponent,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
  entryComponents: [
    AddEnvironmentDialogComponent
  ]
})
export class SharedModule {}
