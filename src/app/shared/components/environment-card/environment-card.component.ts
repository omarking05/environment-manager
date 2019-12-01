import { EnvironmentService } from './../../../core/services/environment.service';
import { DatabaseService } from './../../../core/services/database.service';
import { SUBJECT_TYPE } from './../../model/subject-type';
import { EnvironmentModel } from './../../model/environment.model';
import { ENVIRONMENT_STATUS } from './../../model/environment-status';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChildProcess } from 'child_process';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEnvironmentDialogComponent } from '../add-environment-dialog/add-environment-dialog.component';

@Component({
  selector: 'app-environment-card',
  templateUrl: './environment-card.component.html',
  styleUrls: ['./environment-card.component.scss']
})
export class EnvironmentCardComponent implements OnInit {
  @Input() env: EnvironmentModel;
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() run: EventEmitter<any> = new EventEmitter<any>();
  @Output() stop: EventEmitter<any> = new EventEmitter<any>();

  envChanged: Subject<EnvironmentModel> = new Subject();
  messageNotifier: Subject<any> = new Subject();

  childProcess: ChildProcess  = null;

  constructor(
    private databaseService: DatabaseService,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public dialog: MatDialog
  ) { }

  private _subscribeToEvents() {
    this.environmentService.addListener(this.env, SUBJECT_TYPE.ENV_CHANGED_TYPE, this.envChanged);
    this.environmentService.addListener(this.env, SUBJECT_TYPE.MESSAGE_NOTIFIER_TYPE, this.messageNotifier);

    this.envChanged.subscribe(env => {
      // In case this is not the environment that is updated
      if (this.env.id !== env.id) {
        return;
      }
      // setTimeout is a workaround in case process is finished too fast
      // Then state will change rapidly, in such a way angular will not detect it
      setTimeout(() => {
        this.env = env;
      }, 0);
    });

    this.messageNotifier.subscribe(newMessage => {
      setTimeout(() => {
        this.showMessage(newMessage);
      }, 0);
    });
  }

  private showMessage(message) {
    const hasFocus = document.hasFocus();
    if (hasFocus) {
      return this._snackBar.open(message, 'close', {
        duration: 3000
      });
    }

    return new Notification('Squirrel It', {
      body: message
    });
  }

  private _unsubscribeToEvents() {
    this.envChanged.unsubscribe();
    this.messageNotifier.unsubscribe();
  }

  ngOnInit() {
    this._subscribeToEvents();
  }

  _run() {
    this.childProcess = this.environmentService.runEnvironment(this.env);
    this.run.emit(this.env);
  }

  isRunning() {
    return this.env.pid && this.env.status === ENVIRONMENT_STATUS.RUNNING;
  }

  async _stop() {
    this.env = await this.environmentService.stopEnvironment(this.env, this.childProcess);
    this.stop.emit(this.env);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEnvironmentDialogComponent, {
      width: '50%',
      data: {
        edit: true,
        env: this.env
      }
    });

    dialogRef.afterClosed().subscribe((env: EnvironmentModel) => {
      // In case of user close dialog without filling the data
      // data will be null
      if (!env) {
        return;
      }
      this.env = env;
      this.databaseService.updateEnvironment(env);
    });
  }

  _update() {
    this.openDialog();
    this.update.emit(this.env);
  }

  _remove() {
    this.databaseService.removeEnvironment(this.env);
    this.remove.emit(this.env);
  }

  _showLogs() {
    this._router.navigate(['logs', this.env.id]);
  }
}
