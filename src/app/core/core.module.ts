import { EnvironmentService } from './services/environment.service';
import { EnvironmentStoreService } from './services/environment-store.service';
import { DatabaseService } from './services/database.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DatabaseService,
    EnvironmentStoreService,
    EnvironmentService
  ]
})
export class CoreModule { }
