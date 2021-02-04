import { Component, OnInit, Inject } from '@angular/core';
import { TypeService } from '../../../service/type.service';
import { Type } from '../../../entity/type';
import { Department } from '../../../entity/department';
import { DepartmentService } from '../../../service/department.service'
import { RoomService } from '../../../service/room.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { Room } from 'src/app/entity/room';
import { RoomInfo } from 'src/app/entity/room-info';
import { Subdepartment } from 'src/app/entity/subdepartment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditDialogComponent } from '../../users/edit-dialog/edit-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-editroom-dialog',
  templateUrl: './editroom-dialog.component.html',
  styleUrls: ['./editroom-dialog.component.scss']
})
export class EditroomDialogComponent implements OnInit {

  types: Type[];
  departments: Department[];
  subdep: Subdepartment[];
  room: Room;

  empty: string = '';

  isEquepment: boolean = false;
  isPhone: boolean = false;
  isPlumbing: boolean = false;
  isSignal: boolean = false;
  isEthernet: boolean = false;
  isSocket220: boolean = false;
  isSocket360: boolean = false;

  additional: boolean = false;

  changeAdditional(){
    this.additional = !this.additional;
  }


  roomForm: FormGroup;

  constructor(private typeService: TypeService,
    private snack: MatSnackBar,
    private roomService: RoomService,
    private departmentService: DepartmentService,
    private router: Router,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Room,
    private formBuilder: FormBuilder) {
    this.room = data;
    this.roomForm = this.formBuilder.group({
      'corpus': ['', [Validators.required]],
      'num': ['', [Validators.required]],
      'type': ['', [Validators.required]],
      'department': ['', [Validators.required]],
      'subdepartment': ['', [Validators.required]],
      'squar': ['', [Validators.required]],
      'owner': ['', [Validators.required]],
      'countOfWorker': [''],
      'repair':[''],
      'sitCount': [''],
      'equipment': [''],
      'equipmentDesc': [''],
      'equipmentName': [''],
      'pcCount': [''],
      'printCount': [''],
      'telephone': [''],
      'signalSystem': [''],
      'plumbing': [''],
      'isEthernet': [''],
      'socket220': [''],
      'socket360': [''],
    });

    this.typeService.getTypes().subscribe(response => {
      this.types = response;
    })

    this.departmentService.getDepartments().subscribe(response => {
      this.departments = response
    });

    this.departmentService.getSubdepartmentsByDepartments(this.room.subdepartment.department).subscribe(response => {
      this.subdep = response;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  isEq(){
    this.isEquepment = !this.isEquepment;
  }

  isPh(){
    this.isPhone = !this.isPhone;
  }

  isPlumb(){
    this.isPlumbing = !this.isPlumbing;
  }

  isSig(){
    this.isSignal = !this.isSignal;
  }

  isEther(){
    this.isEthernet = !this.isEthernet;
  }

  isSock220(){
    this.isSocket220 = !this.isSocket220;
  }

  isSock360(){
    this.isSocket360 = !this.isSocket360;
  }


  getPhone(){
    return this.isPhone;
  }

  getEqupment(){
    return this.isEquepment;
  }

  changeSubdepartment(){
    let department = this.roomForm.get('department').value;
    let departmentFromForm = this.departments.find(item => {
      return item.name === this.roomForm.get('department').value;
    });
    const sub = this.departments.filter(item => {
      if(item.name === department){
        this.departmentService.getSubdepartmentsByDepartments(departmentFromForm).subscribe(response => {
          this.subdep = response;
        });
      }
    });
  }

  editRoom(){
    let typeFromForm = this.types.find(item => {
      if(item.name === this.roomForm.get('type').value){
        return item;
      }
    });

    let subDepartmentToDB: Subdepartment;
    subDepartmentToDB = this.subdep.find(item => {
      if(item.name === this.roomForm.get('subdepartment').value){
        return item;
      };
    });

    if(!this.roomForm.invalid){
      let room: Room = new Room;
      room.id = this.room.id;
      room.corpus = this.roomForm.get('corpus').value;
      room.num = this.roomForm.get('num').value;
      room.owner = this.roomForm.get('owner').value;
      room.squar = this.roomForm.get('squar').value;
      room.type = typeFromForm;
      room.subdepartment = subDepartmentToDB;
      let roomInfo: RoomInfo = new RoomInfo;
      roomInfo.id = this.room.id;
      roomInfo.countOfWorker = this.roomForm.get('countOfWorker').value;
      roomInfo.isEthernet = this.roomForm.get('isEthernet').value;
      roomInfo.pcCount = this.roomForm.get('pcCount').value;
      roomInfo.printCount = this.roomForm.get('printCount').value;
      roomInfo.sitCount = this.roomForm.get('sitCount').value;
      roomInfo.plumbing = this.roomForm.get('plumbing').value;
      roomInfo.socket220 = this.roomForm.get('socket220').value;
      roomInfo.socket360 = this.roomForm.get('socket360').value;
      roomInfo.telephone = this.roomForm.get('telephone').value;
      roomInfo.equipment = this.roomForm.get('equipment').value;
      roomInfo.equipmentName = this.roomForm.get('equipmentName').value;
      roomInfo.equipmentDesc = this.roomForm.get('equipmentDesc').value;
      roomInfo.signalSystem  = this.roomForm.get('signalSystem').value;
      roomInfo.repair  = this.roomForm.get('repair').value;
      room.roomInfo = roomInfo;
      this.roomService.editRoom(room).subscribe(res => {
        this.dialogRef.close(res);
      }, (err) => {
        console.log("ERROR")
      },
        () => {
        const snackBarRef = this.snack.open('Помещение успешно изменено', 'OK', {duration: 5000});
        snackBarRef.afterDismissed().subscribe(info => {
          this.dialogRef.close();
        })
      });
    }
  }

}
