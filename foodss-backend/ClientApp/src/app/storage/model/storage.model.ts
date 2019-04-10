import {User} from '../../user/model/user.model';

export class StorageModel {

  id: number;
  name: string;
  isShared: boolean;
  owner: User;
}
