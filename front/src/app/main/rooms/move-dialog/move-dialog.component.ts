import { Component, OnInit, Inject } from '@angular/core';
import { Room } from 'src/app/entity/room';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from 'src/app/service/room.service';
import { Department } from 'src/app/entity/department';
import { Subdepartment } from 'src/app/entity/subdepartment';
import { DepartmentService } from '../../../service/department.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.scss']
})
export class MoveDialogComponent implements OnInit {

  room: Room;
  departments: Department[];
  subdep: Subdepartment[];

  moveForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MoveDialogComponent>,
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: Room) {
    this.room = data;
    this.moveForm = this.formBuilder.group({
      'corpus': ['', [Validators.required]],
      'department': ['', [Validators.required]],
      'subdepartment': ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe(response => {
      this.departments = response;
    })
  }

  move(){
    if(!this.moveForm.invalid){
      let sub = this.subdep.find(item => {
        if(item.name = this.moveForm.get('subdepartment').value){
          return item;
        }
      })
      this.room.corpus = this.moveForm.get('corpus').value;
      this.room.subdepartment = sub;
      this.roomService.moveRoom(this.room).subscribe(response => {
        console.log(response);
        this.onNoClick();
      });
    }
  }

  changeSubdepartment(){
    let department = this.moveForm.get('department').value;
    let departmentFromForm = this.departments.find(item => {
      return item.name === this.moveForm.get('department').value;
    });
    const sub = this.departments.filter(item => {
      if(item.name === department){
        this.departmentService.getSubdepartmentsByDepartments(departmentFromForm).subscribe(response => {
          this.subdep = response;
        });
      }
    });
  }
}
