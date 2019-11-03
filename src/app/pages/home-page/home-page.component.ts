import { EnvironmentModel } from '../../model/environment.model';
import { AddEnvironmentDialogComponent } from './../../components/add-environment-dialog/add-environment-dialog.component';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '../../providers/database.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  environments: EnvironmentModel[] = [];

  constructor(
    public databaseService: DatabaseService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEnvironmentDialogComponent, {
      width: '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((data: EnvironmentModel) => {
      // In case of user close dialog without filling the data
      // data will be null
      if (!data) {
        return;
      }
      this._addNewEnvironment(data);
    });
  }

  _addNewEnvironment(env: EnvironmentModel) {
    this.databaseService.addEnvironment(env);
  }

  refreshEnvironments() {
    this.environments = this.databaseService.getEnvironments();
  }

  ngOnInit() {
    this.refreshEnvironments();
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

}
