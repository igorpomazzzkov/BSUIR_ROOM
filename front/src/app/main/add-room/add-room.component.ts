import { Component, OnInit } from '@angular/core';
import { TypeService } from '../../service/type.service';
import { Type } from '../../entity/type';
import { Department } from '../../entity/department';
import { DepartmentService } from '../../service/department.service'
import { RoomService } from '../../service/room.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { Room } from 'src/app/entity/room';
import { RoomInfo } from 'src/app/entity/room-info';
import { Subdepartment } from 'src/app/entity/subdepartment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {

  types: Type[];
  departments: Department[];
  subdep: Subdepartment[];

  isEquepment: boolean = false;
  isPhone: boolean = false;
  isPlumbing: boolean = false;
  isSignal: boolean = false;
  isSocket: boolean = false;
  isEthernet: boolean = false;
  isSocket220: boolean = false;
  isSocket360: boolean = false;


  roomForm: FormGroup;

  constructor(private typeService: TypeService,
    private snack: MatSnackBar,
    private roomService: RoomService,
    private departmentService: DepartmentService,
    private router: Router,
    private formBuilder: FormBuilder) {
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
      'socket360': ['']
    });

    this.typeService.getTypes().subscribe(response => {
      this.types = response;
    })

    this.departmentService.getDepartments().subscribe(response => {
      this.departments = response
    });
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

  isSoc(){
    this.isSocket = !this.isSocket;
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

  addRoom(){
    let typeFromForm = this.types.find(item => {
      if(item.name === this.roomForm.get('type').value){
        return item;
      }
    });toolbar

    let subDepartmentFromForm = this.roomForm.get('subdepartment').value;
    let subDepartmentToDB: Subdepartment;
    subDepartmentToDB = this.subdep.find(item => {
      if(item.name === this.roomForm.get('subdepartment').value){
        return item;
      };
    });


    if(!this.roomForm.invalid){
      let room: Room = new Room;
      room.corpus = this.roomForm.get('corpus').value;
      room.num = this.roomForm.get('num').value;
      room.owner = this.roomForm.get('owner').value;
      room.squar = this.roomForm.get('squar').value;
      room.type = typeFromForm;
      room.subdepartment = subDepartmentToDB;
      let roomInfo: RoomInfo = new RoomInfo;
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
      this.roomService.addRoom(room).subscribe(res => {
        console.log(res);
      }, (err) => {
        console.log("ERROR")
      },
        () => {
        const snackBarRef = this.snack.open('Помещение успешно добавлено', 'Помещения', {duration: 5000});
        snackBarRef.afterDismissed().subscribe(info => {
          this.router.navigate(['rooms']);
        })
      });
    }
  }

}
