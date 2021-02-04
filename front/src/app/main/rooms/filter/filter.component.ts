import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from 'src/app/service/room.service';
import { Room } from '../../../entity/room';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeService } from '../../../service/type.service';
import { Type } from '../../../entity/type';
import { Department } from '../../../entity/department';
import { DepartmentService } from '../../../service/department.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subdepartment } from 'src/app/entity/subdepartment';
import { RoomInfo } from 'src/app/entity/room-info';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  rooms: Room[];
  types: Type[];
  departments: Department[];
  activeDepartment: Department;
  subdep: Subdepartment[];

  room: Room = new Room;

  filterType: Type = new Type();
  filterDepartment: Department = new Department();
  filterSubdepartment: Subdepartment = new Subdepartment();

  filterForm: FormGroup;

  count: number = 0;

  buttonLabel = '';

  constructor(
    private typeService: TypeService,
    private snack: MatSnackBar,
    private roomService: RoomService,
    private departmentService: DepartmentService,
    private router: Router,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    if(data['filter'] !== undefined){
      this.room = data['filter'];
    }
    this.room.type = new Type();
    this.room.subdepartment = new Subdepartment();
    this.room.subdepartment.department = new Department();
    if(data['type'] !== undefined){
      this.room.type = data['type'];
    }
    if(data['subdepartment'] !== undefined){
      this.room.subdepartment = data['subdepartment'];
    }
    if(data['department'] !== undefined){
      this.room.subdepartment.department = data['department'];
    }
    console.log(this.room);
    this.filterForm = this.formBuilder.group({
      'corpus': [''],
      'num': [''],
      'type': [''],
      'department': [''],
      'subdepartment': [''],
      'squar': [''],
      'owner': ['']
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.typeService.getTypes().subscribe(response => {
      this.types = response;
    });

    this.departmentService.getDepartments().subscribe(response => {
      this.departments = response
    });

    this.roomService.getAllRooms().subscribe(response => {
      this.rooms = response;
    });

    if(this.room.subdepartment.department.name){
      this.departmentService.getSubdepartmentsByDepartments(this.room.subdepartment.department).subscribe(response =>{
        this.subdep = response;
      });
    }
  }

  filter(){
    console.log(this.room);
    this.roomService.searchRoom(this.room).subscribe(response => {
      let resp = {
        'data': response,
        'filter': this.room
      };
      this.dialogRef.close(resp);
    });
  }

  mainDepartmentChange(event){
    this.room.subdepartment.department = this.departments.find(item => {
      if(item.name === event.value){
        return item;
      }
    });
  }

  typeChange(event){
    this.room.type = this.types.find(item => {
      if(item.name === event.value){
        return item;
      }
    });
    this.corpusChange();
  }

  subdepartmentChange(event){
    this.room.subdepartment = this.subdep.find(item => {
      if(item.name === event.value){
        return item;
      }
    });
    this.corpusChange();
  }

  corpusChange(){
    let roomss: Room[] = this.rooms.filter(item => {
      if(this.room.corpus){
        if(item.corpus === this.room.corpus){
          return item;
        }
      } else {
        return item;
      }
    });
    roomss = roomss.filter(item => {
      if(this.room.num !== undefined){
        if(this.room.num !== null){
          if(item.num === this.room.num.toString()){
            return item;
          }
        } else{
          return item;
        }
      } else {
        return item;
      }
    });

    roomss = roomss.filter(item => {
      if(this.room.owner !== undefined){
        if(this.room.owner !== null){
          if(item.owner === this.room.owner.toString()){
            return item;
          }
        } else{
          return item;
        }
      } else {
        return item;
      }
    });

    roomss = roomss.filter(item => {
      if(this.room.squar !== undefined){
        if(this.room.squar !== null){
          if(item.squar === this.room.squar){
            return item;
          }
        } else{
          return item;
        }
      } else {
        return item;
      }
    });

    roomss = roomss.filter(item => {
      if(this.room.type.name !== undefined){
        if(item.type.name === this.room.type.name){
          return item;
        }
      } else {
        return item;
      }
    });

    roomss = roomss.filter(item => {
      if(this.room.subdepartment.department.id !== undefined){
        if(item.subdepartment.department.id === this.room.subdepartment.department.id){
          return item;
        }
      } else {
        return item;
      }
    });

    roomss = roomss.filter(item => {
      if(this.room.subdepartment.id !== undefined){
        if(item.subdepartment.id === this.room.subdepartment.id){
          return item;
        }
      } else {
        return item;
      }
    });
    this.buttonLabel = ': ' + roomss.length.toString();
  }

  changeSubdepartment(event){
    this.room.subdepartment = new Subdepartment;
    this.room.subdepartment.department = this.departments.find(item => {
      if(item.name === event.value){
        return item;
      }
    });
    const sub = this.departments.filter(item => {
      if(item.name === event.value){
        this.departmentService.getSubdepartmentsByDepartments(this.room.subdepartment.department).subscribe(response => {
          this.subdep = response;
        });
      }
    });
    this.corpusChange();
  }

  reload(){
    this.room.corpus = undefined;
    this.room.num = undefined;
    this.room.type.name = undefined;
    this.room.type.id = undefined;
    this.room.subdepartment.department.name = undefined;
    this.room.subdepartment.name = undefined;
    this.room.owner = undefined;
    this.room.squar = undefined;
    this.buttonLabel = '';
    console.log(this.room);
    this.roomService.getAllRooms().subscribe(response => {
      this.rooms = response;
    });
  }
}
