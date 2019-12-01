import { EnvLogsComponent } from './env-logs.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [EnvLogsComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class EnvLogsModule {}
