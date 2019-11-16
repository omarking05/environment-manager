import { ENVIRONMENT_DATA } from './../model/environment-data';
import { EnvironmentModel } from './../model/environment.model';
import ElectronStore from 'electron-store';
import { Injectable } from '@angular/core';

import { ElectronService } from './electron.service';
import * as Tail from 'node.tail';
import log, { IElectronLog } from 'electron-log';

const MAIN_DB_FILE_NAME = 'mrgeek-env-management';

@Injectable()
export class DatabaseService {
  static readonly ENVIRONMENTS = 'environments';

  environments = [];

  log: IElectronLog;
  store: ElectronStore;
  storeConfig: ElectronStore.Options<any> = {
    name: MAIN_DB_FILE_NAME,
    schema: {
      environments: {
        type: 'array',
        default: []
      }
    }
  };

  constructor(public electronService: ElectronService) {
    this.initDatabase();
    this.loadData();
  }

  private loadData() {
    this.environments = this.store.get(DatabaseService.ENVIRONMENTS);
  }

  private initDatabase() {
    this.store = new ElectronStore(this.storeConfig);
  }

  private flushData(key) {
    this.store.set(key, this[key]);
  }

  private generateLogFileName(env: EnvironmentModel, type: string) {
    return `${env.name.replace(' ', '_').toLowerCase()}-${env.id}-${type}.log`;
  }

  private getEnvironmentLogStore(env: EnvironmentModel, type: string) {
    log.transports.file.fileName  = this.generateLogFileName(env, type);
    log.transports.console.format = '';
    return log;
  }

  private addlogFileToEnv(env: EnvironmentModel, logFile: string) {
    // Environment already has log file path saved
    if (env.logFile && env.logFile !== '' && env.logFile === logFile) {
      return;
    }
    env.logFile = log.transports.file.fileName;
    this.updateEnvironment(env);
  }

  writeEnvironmentLogs(env: EnvironmentModel, type: string, data: string) {
    if (data === '') {
      return;
    }
    const logStore  = this.getEnvironmentLogStore(env, type);
    this.addlogFileToEnv(env, logStore.transports.file.fileName);
    logStore.info(data);
  }

  tailEnvironmentLogs(env: EnvironmentModel, type: string) {
    const logPath = this.electronService.path.join(this.electronService.eApp.getPath('userData'), this.generateLogFileName(env, type));
    return new Tail(logPath, {
      follow: true,
      lines: 100
    });
  }

  addEnvironment(env: EnvironmentModel) {
    this.environments.push(env);
    this.flushData(DatabaseService.ENVIRONMENTS);
    return this;
  }

  removeEnvironment(env: EnvironmentModel) {
    this.environments = this.environments.filter(_env => _env !== env);
    this.flushData(DatabaseService.ENVIRONMENTS);
    return this;
  }

  updateEnvironment(_newEnv: EnvironmentModel) {
    this.environments = this.environments.map((_env: EnvironmentModel) => {
      if (_env.id === _newEnv.id) {
        return _newEnv;
      }
      return _env;
    });
    this.flushData(DatabaseService.ENVIRONMENTS);
    return this;
  }

  getEnvironment(id) {
    // First load db
    this.loadData();
    return this.environments.find((_env: EnvironmentModel) => _env.id === id);
  }

  getEnvironments() {
    return this.environments;
  }
}
