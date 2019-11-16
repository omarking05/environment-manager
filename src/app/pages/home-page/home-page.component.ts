import { EnvironmentModel } from '../../model/environment.model';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../providers/database.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  
  environments: EnvironmentModel[] = [];

  constructor(
    public databaseService: DatabaseService,
  ) {
  }

  refreshEnvironments() {
    this.environments = this.databaseService.getEnvironments();
  }

  ngOnInit() {
    this.refreshEnvironments();
  }
}
