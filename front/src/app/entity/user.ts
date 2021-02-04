import { Role } from './role';

export class User{
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  roles: Role[];
  password: string;
}
