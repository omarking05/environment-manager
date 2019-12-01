import { SUBJECT_TYPE } from './../../shared/model/subject-type';
import { EnvironmentService } from './../../core/services/environment.service';
import { DatabaseService } from './../../core/services/database.service';
import { EnvironmentModel } from './../../shared/model/environment.model';
import { Subject } from 'rxjs';
import { Component, OnInit, AfterViewChecked, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-env-logs',
  templateUrl: './env-logs.component.html',
  styleUrls: ['./env-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EnvLogsComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  readLog: Subject<any> = new Subject();
  envId: string;
  env: EnvironmentModel;
  logs = '';

  constructor(
    private _route: ActivatedRoute,
    private databaseService: DatabaseService,
    private environmentService: EnvironmentService,
    private _router: Router,
    private _ref: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this._route.params.subscribe(params => {
      this.envId = params.id;
    });
  }

  getEnvironment() {
    this.env = this.databaseService.getEnvironment(this.envId);
  }

  appendToLogStream(data) {
    this.logs += '\n' + data;
    this._ref.detectChanges();
  }

  listenToLogs() {
    // Get environment again, to make sure its updated
    this.getEnvironment();

    // In env has no log file, yet
    if (this.env && !this.env.logFile) {
      return;
    }

    this.environmentService.readEnvironmentLogs(this.env);

    this.readLog.subscribe(data => {
      this._ngZone.run(() => {
        this.logs += '\n' + data;
      });
      this._ref.detectChanges();
    }, (err) => {
      console.log('Error occurred..');
    });
  }

  _subscribeToEvents() {
    this.environmentService.addListener(this.env, SUBJECT_TYPE.READ_LOGS_TYPE, this.readLog);
  }

  _showEnvironments() {
    this._router.navigate(['']);
  }

  scrollToBottom(): void {
    try {
      if (!this.myScrollContainer) {
        return;
      }
      
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log('Error', err);
    }
  }

  ngOnInit() {
    this.getEnvironment();

    // In case environment is not defined
    if (!this.env) {
      return;
    }

    this._subscribeToEvents();
    this.listenToLogs();
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this._ref.detach();
    this.readLog.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

}
