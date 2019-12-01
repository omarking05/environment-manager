import { AddEnvironmentDialogComponent } from './shared/components/add-environment-dialog/add-environment-dialog.component';
import { DatabaseService } from './core/services/database.service';
import { EnvironmentModel } from './shared/model/environment.model';
import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private isQuiting = false;
  public appName = '';

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private databaseService: DatabaseService,
    private dialog: MatDialog,
  ) {
    
    // console.log('AppConfig', AppConfig);

    // if (electronService.isElectron) {
    //   console.log(process.env);
    //   console.log('Mode electron');
    //   console.log('Electron ipcRenderer', electronService.ipcRenderer);
    //   console.log('NodeJS childProcess', electronService.childProcess);
    // } else {
    //   console.log('Mode web');
    // }

    this._init();
  }

  _init() {
    this.appName = this.electronService.remote.app.name;
    this.translate.setDefaultLang('en');
    this._addDeveloperToolsSupport();
    this._createTrayIcon();
  }

  _addDeveloperToolsSupport() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        this.electronService.remote.getCurrentWindow().webContents.openDevTools();
      }
    });
  }

  _createTrayIcon() {
    const tray        = new this.electronService.remote.Tray('src/favicon.png');
    const mainWindow  = this.electronService.remote.getCurrentWindow();
    const contextMenu = this.electronService.remote.Menu.buildFromTemplate([
      { label: 'Open', click: () => {
          mainWindow.show();
        }
      },
      { label: 'Quit', click: () => {
          this.isQuiting = true;
          this.electronService.remote.app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);

    mainWindow.on('minimize', (event) => {
      event.preventDefault();
      mainWindow.hide();
    });

    this.electronService.remote.app.on('before-quit', (event) => {
      console.log(event);
      event.preventDefault();

      // if (!this.isQuiting) {
      //   event.preventDefault();
      //   mainWindow.hide();
      // }
      return false;
    });
  }

  addNewEnvironment(env: EnvironmentModel) {
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
      this.addNewEnvironment(data);
    });
  }
}
