import { StorageService } from './storage.service';
import { UserCollection } from './entities/users/user.collection';
import { AuthCollection } from './entities/auth/auth.collection';

export const storageProviders: any[] = [
  {
    provide: 'StorageService',
    useFactory: async (): Promise<StorageService> => {
      const storageService: StorageService = new StorageService();
      await storageService.init();
      return storageService;
    },
  },
  {
    provide: 'UserCollection',
    useFactory: (storage: StorageService): UserCollection => {
      return new UserCollection(storage);
    },
    inject: ['StorageService'],
  },
  {
    provide: 'AuthCollection',
    useFactory: (storage: StorageService): AuthCollection => {
      return new AuthCollection(storage);
    },
    inject: ['StorageService'],
  },
];
