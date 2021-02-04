import { Type } from './type';
import { Subdepartment } from './subdepartment';
import { RoomInfo } from './room-info';

export class Room{
  id: number;
  corpus: number;
  num: string;
  squar: number;
  owner: string;
  type: Type;
  subdepartment: Subdepartment;
  roomInfo: RoomInfo;
}
