import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-environment-dialog',
  templateUrl: './add-environment-dialog.component.html',
  styleUrls: ['./add-environment-dialog.component.scss']
})
export class AddEnvironmentDialogComponent implements OnInit {

  addEnvForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddEnvironmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addEnvForm = this._formBuilder.group({
      id: [this.data.env ? this.data.env.id : ''],
      logFile: [this.data.env ? this.data.env.logFile : ''],
      pid: [this.data.env ? this.data.env.pid : ''],
      status: [this.data.env ? this.data.env.status : ''],
      name: [this.data.env ? this.data.env.name : '', Validators.required],
      path: [this.data.env ? this.data.env.path : '', Validators.required],
      command: [this.data.env ? this.data.env.command : '', Validators.required]
    });
  }

  submitForm() {
    if (this.addEnvForm.valid) {
      if (!this.data.edit) {
        this.generateRandomeId();
      }
      return this.dialogRef.close(this.addEnvForm.value);
    }
  }

  generateRandomeId() {
    this.addEnvForm.get('id').setValue(uuidv4());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
