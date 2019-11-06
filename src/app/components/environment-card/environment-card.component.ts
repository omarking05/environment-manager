import { EnvironmentModel } from './../../model/environment.model';
import { arrayBufferToString } from './../../utils/helper.util';
import { ENVIRONMENT_DATA } from './../../model/environment-data';
import { EnvironmentService } from './../../providers/environment.service';
import { ENVIRONMENT_STATUS } from './../../model/environment-status';
import { DatabaseService } from './../../providers/database.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ChildProcess } from 'child_process';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-environment-card',
  templateUrl: './environment-card.component.html',
  styleUrls: ['./environment-card.component.scss']
})
export class EnvironmentCardComponent implements OnInit, OnDestroy {
  @Input() env: EnvironmentModel;
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() run: EventEmitter<any> = new EventEmitter<any>();
  @Output() stop: EventEmitter<any> = new EventEmitter<any>();

  envChanged: Subject<EnvironmentModel> = new Subject();
  logChanged: Subject<any> = new Subject();

  childProcess: ChildProcess  = null;
  lastNLinesOfLog               = '';

  constructor(
    private databaseService: DatabaseService,
    private environmentService: EnvironmentService
  ) { }

  private _subscribeToEvents() {
    this.environmentService.bindListeners(this.envChanged, this.logChanged);
    this.envChanged.subscribe(env => {
      // setTimeout is a workaround in case process is finished too fast
      // Then state will change rapidly, in such a way angular will not detect it
      setTimeout(() => {
        this.env = env;
      }, 0);
    });

    this.logChanged.subscribe(changed => {
      console.log(changed);
      this.lastNLinesOfLog = '\n' + this.databaseService.getLastNLinesOfLogFile(this.env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, 10);
    });
  }

  private _unsubscribeToEvents(){
    this.envChanged.unsubscribe();
    this.logChanged.unsubscribe();
  }

  ngOnInit() {
    this.lastNLinesOfLog = '\n' + this.databaseService.getLastNLinesOfLogFile(this.env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, 10);
    this._subscribeToEvents();
  }

  ngOnDestroy() {
    this._unsubscribeToEvents();
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

  _update() {
    this.update.emit(this.env);
  }

  _remove() {
    this.databaseService.removeEnvironment(this.env);
    this.remove.emit(this.env);
  }
}
