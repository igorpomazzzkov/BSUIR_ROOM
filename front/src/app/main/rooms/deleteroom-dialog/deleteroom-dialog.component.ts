import { Component, OnInit, Inject } from '@angular/core';
import { Room } from 'src/app/entity/room';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-deleteroom-dialog',
  templateUrl: './deleteroom-dialog.component.html',
  styleUrls: ['./deleteroom-dialog.component.scss']
})
export class DeleteroomDialogComponent implements OnInit {

  room: Room;

  constructor(
    public dialogRef: MatDialogRef<DeleteroomDialogComponent>,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: Room) {
    this.room = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  deleteRoom(){
    this.roomService.deleteRoom(this.room).subscribe(response => {
      this.dialogRef.close(this.room);
    })
  }

}
