import { SharedModule } from './../../shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomePageModule {}
