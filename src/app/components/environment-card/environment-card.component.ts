import { ElectronService } from './../../providers/electron.service';
import { DatabaseService } from './../../providers/database.service';
import { EnvironmentModel } from '../../model/environment.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor(
    private databaseService: DatabaseService,
    private electronService: ElectronService
  ) { }

  ngOnInit() {
  }

  _run() {
    const commandProcess = this.electronService.childProcess.exec(this.env.command, {
      cwd: this.env.path
    });

    console.log(commandProcess.pid);

    commandProcess.on('error', function(err) {
      console.log(err);
    });

    commandProcess.stdout.on('data', function (data) {
      const str = (new TextDecoder('utf-8')).decode(data);
      console.log(str);
    });

    commandProcess.stderr.on('data', function (data) {
      console.log(data);
    });

    commandProcess.on('close', function (code) {
      if (code === 0) {
        console.log('child process complete.');
      } else {
        console.log('child process exited with code ' + code);
      }
    });

    this.run.emit(this.env);
  }

  _stop() {

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
