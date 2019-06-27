import { User } from '../../../../user/model/user.model';
import { StorageModel } from '../../../../storage/model/storage.model';

export class StorageInvitationModel {
  invitation?: Array<StorageInvitationModel>;
  storageId: number;
  authorId: number;
  userEmail: string;
  author?: User;
  user?: User;
  storage?: StorageModel;
}
