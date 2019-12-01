import { ENVIRONMENT_DATA } from './../../shared/model/environment-data';
import { EnvironmentModel } from './../../shared/model/environment.model';
import { ElectronService } from './electron/electron.service';
import { Injectable } from '@angular/core';
import * as jetpack from 'fs-jetpack';
import * as Tail from 'node.tail';

@Injectable()
export class EnvironmentStoreService {

  constructor(public electronService: ElectronService) {}

  private generateLogFileName(env: EnvironmentModel, type: string) {
    return `${env.name.replace(' ', '_').toLowerCase()}-${env.id}-${type}.log`;
  }

  private getLogFilePath(env: EnvironmentModel, type: string) {
    return this.electronService.path.join(this.electronService.remote.app.getPath('userData'), this.generateLogFileName(env, type));
  }


  writeEnvironmentLogs(env: EnvironmentModel, type: string, data: string) {
    if (data === '') {
      return;
    }
    const logFile = this.getLogFilePath(env, type);
    jetpack.append(logFile, data);
  }

  tailEnvironmentLogs(env: EnvironmentModel, type: string) {
    const logPath = this.getLogFilePath(env, type);
    return new Tail(logPath, {
      follow: true,
      lines: 100
    });
  }

  removeLogFiles(env: EnvironmentModel) {
    try {
      const stdLogFilePath = this.getLogFilePath(env, ENVIRONMENT_DATA.LOG_FILE_STD_TYPE);
      jetpack.remove(stdLogFilePath);
    } catch (e) {
      console.log('File does not exist');
    }

    try {
      const errLogFilePath = this.getLogFilePath(env, ENVIRONMENT_DATA.LOG_FILE_ERR_TYPE);
      jetpack.remove(errLogFilePath);
    } catch (e) {
      console.log('File does not exist');
    }
  }
}
