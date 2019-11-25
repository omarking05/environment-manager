import { MatDialog } from '@angular/material/dialog';
import { EnvironmentModel } from './model/environment.model';
import { AddEnvironmentDialogComponent } from './components/add-environment-dialog/add-environment-dialog.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { DatabaseService } from './providers/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public dataService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    public databaseService: DatabaseService,
  ) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      // console.log('Mode electron');
      // console.log('Electron ipcRenderer', electronService.ipcRenderer);
      // console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        this.electronService.remote.getCurrentWindow().webContents.openDevTools();
      }
    });
  }

  _addNewEnvironment(env: EnvironmentModel) {
    this.databaseService.addEnvironment(env);
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

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
