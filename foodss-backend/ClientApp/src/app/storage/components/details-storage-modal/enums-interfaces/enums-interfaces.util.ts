import { StorageModel } from 'src/app/storage/model/storage.model';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface StorageUser {
  storageId: number;
  userId: number;
  storage?: StorageModel;
  user?: User;
}

export interface StorageInvitation {
  storageId: number;
  authorId: number;
  userEmail: string;
  storage?: StorageModel;
  author?: User;
  user?: User;
}
