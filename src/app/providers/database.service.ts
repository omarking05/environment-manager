import { EnvironmentModel } from '../model/environment.model';
import ElectronStore from 'electron-store';
import { Injectable } from '@angular/core';

import { app, remote } from 'electron';
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

  getEnvironments() {
    return this.environments;
  }
}
