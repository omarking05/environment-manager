import { ENVIRONMENT_DATA } from './../model/environment-data';
import { EnvironmentModel } from './../model/environment.model';
import ElectronStore from 'electron-store';
import { Injectable } from '@angular/core';

import { ElectronService } from './electron.service';

const MAIN_DB_FILE_NAME = 'mrgeek-env-management';

@Injectable()
export class DatabaseService {
  static readonly ENVIRONMENTS = 'environments';

  environments = [];

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
    return `${env.name.replace(' ', '_').toLowerCase()}-${env.id}-${type}`;
  }

  private getEnvironmentLogStore(env: EnvironmentModel, type: string) {
    return new ElectronStore({
      name: this.generateLogFileName(env, type),
      cwd: `${env.id}`,
      fileExtension: 'log'
    });
  }

  writeEnvironmentLogs(env: EnvironmentModel, type: string, data: string) {
    const logStore  = this.getEnvironmentLogStore(env, type);
    let logData     = logStore.get(ENVIRONMENT_DATA.LOG_FILE_KEY, '');
    logData         += data;
    logStore.set(ENVIRONMENT_DATA.LOG_FILE_KEY, logData);
  }

  readEnvironmentLogs(env: EnvironmentModel, type: string) {
    const logStore  = this.getEnvironmentLogStore(env, type);
    return logStore.get(ENVIRONMENT_DATA.LOG_FILE_KEY, '');
  }

  getLastNLinesOfLogFile(env: EnvironmentModel, type: string, n: number) {
    const logData: string     = this.readEnvironmentLogs(env, type);

    if (logData === '\n') {
      return logData;
    }

    const logDataLines        = logData.split('\n');
    const logDataLinesLength  = logDataLines.length;
    return logDataLines.slice(logDataLinesLength - n, logDataLinesLength).join('\n').replace(/^\s+|\s+$/g, '');
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
