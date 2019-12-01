import { ElectronService } from './electron/electron.service';
import { EnvironmentModel } from './../../shared/model/environment.model';
import { EnvironmentStoreService } from './environment-store.service';
import ElectronStore from 'electron-store';
import { Injectable } from '@angular/core';

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

  constructor(public electronService: ElectronService, public environmentStoreService: EnvironmentStoreService) {
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

  public addlogFileToEnv(env: EnvironmentModel, logFilePath: string) {
    // Environment already has log file path saved
    if (env.logFile && env.logFile !== '' && env.logFile === logFilePath) {
      return;
    }
    env.logFile = logFilePath;
    this.updateEnvironment(env);
  }

  addEnvironment(env: EnvironmentModel) {
    this.environments.push(env);
    this.flushData(DatabaseService.ENVIRONMENTS);
    return this;
  }

  removeEnvironment(env: EnvironmentModel) {
    // First remove log files
    this.environmentStoreService.removeLogFiles(env);
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
