import { ENVIRONMENT_STATUS } from './../../shared/model/environment-status';
import { ENVIRONMENT_DATA } from './../../shared/model/environment-data';
import { SUBJECT_TYPE } from './../../shared/model/subject-type';
import { EnvironmentModel } from './../../shared/model/environment.model';
import { ElectronService } from './electron/electron.service';
import { EnvironmentStoreService } from './environment-store.service';
import { arrayBufferToString, isActuallyKilled, forceKillProcess } from '../../shared/utils/helper.util';
import { ChildProcess } from 'child_process';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EnvironmentService {

  subjectsPool = [];

  constructor(
    public electronService: ElectronService,
    public databaseService: DatabaseService,
    public environmentStoreService: EnvironmentStoreService
  ) {
  }

  private generateSubjectKeyName(env: EnvironmentModel, type: string) {
    return `${env.id}-${type}`;
  }

  private getSubject(env: EnvironmentModel, type: string) {
    return this.subjectsPool.find(_subject => {
      return _subject['key'] === this.generateSubjectKeyName(env, type);
    });
  }

  private emitEvent(env: EnvironmentModel, eventType: string, data: any = null) {
    const subject: Subject<any> = this.getSubject(env, eventType)['subject'];
    // Only broadcast event, if we have observers
    if (subject.observers) {
      subject.next(data);
    }
  }

  private bindEvents(env: EnvironmentModel, childProcess: ChildProcess) {
    // const self        = this;

    childProcess.on('error', (err) => {
      this.environmentStoreService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_ERR_TYPE, err.message);
    });

    childProcess.stdout.on('data', (data) => {
      this.environmentStoreService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, arrayBufferToString(data));
    });

    childProcess.stderr.on('data', (data) => {
      this.environmentStoreService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, arrayBufferToString(data));
    });

    childProcess.on('close', (code) => {
      // In case env closed on its own, not force closed
      if (null !== code) {
        this.emitEvent(env, SUBJECT_TYPE.MESSAGE_NOTIFIER_TYPE, `Environment (${env.name}) has finished.`);
      }

      this.environmentStoreService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE,
        `Environment finished with code ${code}`
      );
      this.changeEnvironmentStatus(env, null, ENVIRONMENT_STATUS.STOPPED);
    });

    childProcess.on('exit', (code) => {
      this.environmentStoreService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE,
        `Environment exited with code ${code}`
      );
      this.changeEnvironmentStatus(env, null, ENVIRONMENT_STATUS.STOPPED);
    });
  }

  changeEnvironmentStatus(env, pid, status) {
    env.pid    = pid;
    env.status = status;
    this.databaseService.updateEnvironment(env);
    this.emitEvent(env, SUBJECT_TYPE.ENV_CHANGED_TYPE, env);
    return env;
  }

  async stopEnvironment(env: EnvironmentModel, childProcess: ChildProcess = null) {
    // In case command already stopped, and finished
    if (!env.pid) {
      return env;
    }

    if (null !== childProcess) {
      childProcess.kill();
    }

    const killed   = await forceKillProcess(env.pid);
    const isKilled = await isActuallyKilled(env.pid);

    if (killed || isKilled) {
      this.emitEvent(env, SUBJECT_TYPE.MESSAGE_NOTIFIER_TYPE, `Environment (${env.name}) is now stopped.`);
      this.changeEnvironmentStatus(env, null, ENVIRONMENT_STATUS.STOPPED);
    } else {
      this.emitEvent(env, SUBJECT_TYPE.MESSAGE_NOTIFIER_TYPE, `Could not kill the process, please try closing it manually, PID: ${env.pid}`);
    }

    return env;
  }

  runEnvironment(env: EnvironmentModel) {
    const commandSplitted = env.command.split(' ');
    const mainCommand     = commandSplitted.shift();
    const childProcess    = this.electronService.childProcess.spawn(mainCommand, commandSplitted, {
      cwd: env.path,
      detached: true
    });

    this.emitEvent(env, SUBJECT_TYPE.MESSAGE_NOTIFIER_TYPE, `Environment (${env.name}) is now running`);
    this.changeEnvironmentStatus(env, childProcess.pid, ENVIRONMENT_STATUS.RUNNING);
    this.bindEvents(env, childProcess);

    return childProcess;
  }

  readEnvironmentLogs(env: EnvironmentModel) {
    this.environmentStoreService.tailEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE).on('line', (data: string) => {
      this.emitEvent(env, SUBJECT_TYPE.READ_LOGS_TYPE, data);
    });
  }

  private listenerExists(env: EnvironmentModel, type: string) {
    const found = this.subjectsPool.find(_subject => {
      return _subject.key === this.generateSubjectKeyName(env, type);
    });
    return found;
  }

  private removeExistingListener(env: EnvironmentModel, type: string) {
    this.subjectsPool = this.subjectsPool.filter(_subject => {
      return _subject.key !== this.generateSubjectKeyName(env, type);
    });
  }

  addListener(env: EnvironmentModel, type: string, _subject: Subject<any>) {
    if (!env) {
      return;
    }
    
    this.removeExistingListener(env, type);
    const subject = {
      key: this.generateSubjectKeyName(env, type),
      subject: _subject
    };
    this.subjectsPool.push(subject);
  }
}
