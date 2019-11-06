import { ENVIRONMENT_DATA } from './../model/environment-data';
import { arrayBufferToString, isActuallyKilled, forceKillProcess } from './../utils/helper.util';
import { ENVIRONMENT_STATUS } from './../model/environment-status';
import { EnvironmentModel } from './../model/environment.model';
import { ChildProcess } from 'child_process';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Subject } from 'rxjs';

@Injectable()
export class EnvironmentService {

  envChanged: Subject<EnvironmentModel>;
  logChanged: Subject<any>;

  constructor(public electronService: ElectronService, public databaseService: DatabaseService) {
  }

  private bindeEvents(env: EnvironmentModel, childProcess: ChildProcess) {
    const self        = this;

    childProcess.on('error', function(err) {
      self.databaseService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_ERR_TYPE, err.message);
      self.emitLogChangeEvent();
    });

    childProcess.stdout.on('data', function (data) {
      self.databaseService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, arrayBufferToString(data));
      self.emitLogChangeEvent();
    });

    childProcess.stderr.on('data', function (data) {
      self.databaseService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE, arrayBufferToString(data));
      self.emitLogChangeEvent();
    });

    childProcess.on('close', function (code) {
      self.databaseService.writeEnvironmentLogs(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE,
        `Environment finished with code ${code}`
      );
      self.changeEnvironmentStatus(env, null, ENVIRONMENT_STATUS.STOPPED);
    });
  }

  private emitLogChangeEvent() {
    this.logChanged.next('CHANGED');
    console.log('Emitted');
  }

  changeEnvironmentStatus(env, pid, status) {
    env.pid    = pid;
    env.status = status;
    this.databaseService.updateEnvironment(env);
    this.envChanged.next(env);
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

    const killed = forceKillProcess(env.pid);
    const isKilled = await isActuallyKilled(env.pid);

    if (killed || isKilled) {
      this.changeEnvironmentStatus(env, null, ENVIRONMENT_STATUS.STOPPED);
    } else {
      console.log('Could not kill the process, please try closing it manually.', env.pid);
    }

    return env;
  }

  runEnvironment(env: EnvironmentModel) {
    const childProcess  = this.electronService.childProcess.exec(env.command, {
      cwd: env.path
    });

    this.changeEnvironmentStatus(env, childProcess.pid, ENVIRONMENT_STATUS.RUNNING);
    this.bindeEvents(env, childProcess);

    return childProcess;
  }

  bindListeners(envChanged: Subject<EnvironmentModel>, logChanged: Subject<any>) {
    this.envChanged     = envChanged;
    this.logChanged     = logChanged;
  }
}
