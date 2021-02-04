import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoomService } from '../../service/room.service';
import { TypeService } from '../../service/type.service';
import { Room } from '../../entity/room';
import { Type } from '../../entity/type';
import { Department } from '../../entity/department';
import { Subdepartment } from '../../entity/subdepartment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { EditroomDialogComponent} from './editroom-dialog/editroom-dialog.component'
import { DeleteroomDialogComponent } from './deleteroom-dialog/deleteroom-dialog.component';
import { FilterComponent } from './filter/filter.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class RoomsComponent implements OnInit {

  displayedColumns: string[] = [
    'corpus',
    'num',
    'subdepartment.department.name',
    'subdepartment.name',
    'subdepartment.item',
    'type.name',
    'squar',
    'owner'
  ];
  dataSource: MatTableDataSource<Room>;
  rooms: Room[];
  types: Type[];
  expandedElement: Room | null;

  activeFilter: Room;
  activeType: Type;
  activeDepartment: Department;
  activeSubdepartment: Subdepartment;

  index: number = 8;

  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private typeService: TypeService,
    private roomSerice: RoomService) {
      this.activeFilter = new Room();
      this.activeFilter.type = this.activeType;
    }

  isCheck(column: string, checker){
    if(checker.checked){
      if(column.indexOf('.') != -1){
        let firstColumn = column.substring(0, column.indexOf('.'));
        let secondColumn = column.substring(column.indexOf('.') + 1);
        this.setDatasource(this.rooms.filter(item => {
          let itemInfo = item[firstColumn];
          if(itemInfo !== null){
            if(item !== null){
              return item;
            }
          }
        }));
      } else {
        this.setDatasource(this.rooms.filter(item => {
          let itemInfo = item[column];
          if(itemInfo !== null){
            if(item !== null){
              return item;
            }
          }
        }));
      }
      this.displayedColumns.splice(this.index, 0, column);
    } else if(!checker.checked){
      this.index = this.displayedColumns.findIndex((elem) => {
        return elem === column;
      });
      this.setDatasource(this.rooms);
      this.displayedColumns.splice(this.index, 1);
    }
  }

  moveRoom(room: Room){
    const dialogRef = this.dialog.open(MoveDialogComponent, {
      width: '500px',
      data: room
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        const index = this.rooms.indexOf(result);
        const newUser = [
          ...this.rooms.splice(0, index),
          ...this.rooms.splice(index + 1)
        ];
        this.rooms = newUser;
        this.expandedElement = null;
        this.setDatasource(this.rooms);
      }
    });
  }

  editRoom(room:Room){
    const dialogRef = this.dialog.open(EditroomDialogComponent, {
      width: '70%',
      data: room
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const index = this.rooms.indexOf(result);
        this.rooms.splice(index, 1, result);
        this.expandedElement = null;
        this.setDatasource(this.rooms);
      }
    });
  }

  deleteRoom(room: Room){
    const dialogRef = this.dialog.open(DeleteroomDialogComponent, {
      width: '400px',
      data: room
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        const index = this.rooms.indexOf(result);
        const newUser = [
          ...this.rooms.splice(0, index),
          ...this.rooms.splice(index + 1)
        ];
        this.rooms = newUser;
        this.expandedElement = null;
        this.setDatasource(this.rooms);
      }
    });
  }

  setDatasource(rooms: Room[]){
    this.dataSource = new MatTableDataSource(rooms);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'subdepartment.name' : return item.subdepartment.name;
        case 'subdepartment.item': return item.subdepartment.item;
        case 'subdepartment.department.name': return item.subdepartment.department.name;
        case 'roomInfo.countOfWorker': return item.roomInfo.countOfWorker;
        case 'roomInfo.equipment': return item.roomInfo.equipment;
        case 'roomInfo.isEthernet': return item.roomInfo.isEthernet;
        case 'roomInfo.equipmentDesc': return item.roomInfo.equipmentDesc;
        case 'roomInfo.equipmentName': return item.roomInfo.equipmentName;
        case 'roomInfo.pcCount': return item.roomInfo.pcCount;
        case 'roomInfo.plumbing': return item.roomInfo.plumbing;
        case 'roomInfo.printCount': return item.roomInfo.printCount;
        case 'roomInfo.repair': return item.roomInfo.repair;
        case 'roomInfo.signalSystem': return item.roomInfo.signalSystem;
        case 'roomInfo.sitCount': return item.roomInfo.sitCount;
        case 'roomInfo.socket220': return item.roomInfo.socket220;
        case 'roomInfo.socket360': return item.roomInfo.socket360;
        case 'roomInfo.telephone': return item.roomInfo.telephone;
        case 'type.name': return item.type.name;
        default: return item[property];
      }
    }
  }

  openFilter(){
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '400px',
      data: {
        'filter': this.activeFilter,
        'type': this.activeType,
        'department': this.activeDepartment,
        'subdepartment': this.activeSubdepartment
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.rooms = result['data'];
        this.activeFilter = result['filter'];
        this.activeType = result['filter'].type;
        this.activeDepartment = result['filter'].subdepartment.department;
        this.activeSubdepartment = result['filter'].subdepartment;
        this.setDatasource(this.rooms);
      }
    });
  }

  ngOnInit(): void {
    this.roomSerice.getAllRooms().subscribe(response => {
      this.rooms = response;
      this.setDatasource(response);
    });

    this.typeService.getTypes().subscribe(response => {
      this.types = response;
    });
  }

  getCountByNum(val: string){
    return this.rooms.map(t => t.roomInfo[val]).reduce((acc, value) => acc + value, 0);
  }

  getCountByBool(val: string){
    return this.rooms.map(item => item.roomInfo[val]).filter(item => {
      if(item){
        return item;
      }
    }).length;
  }

  getCountByString(val: string){
    return this.rooms.map(item => item.roomInfo[val]).filter(item => {
      if(item !== null){
        return item;
      }
    }).length;
  }

  exportToExcel(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    ws['!rows'] = [];
    for(let i = 1; i <= 1000; i++){
      if(i % 2 == 0 || i == 1){
        ws['!rows'][i] = { hidden: true };
        if(i == 1){
          ws['!cols'].push({width: 25})
        }
        ws['!cols'].push({ width: 25, })
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Exported_File.xlsx');
  }
}
