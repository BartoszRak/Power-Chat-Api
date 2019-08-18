import { Module } from '@nestjs/common'

import { storageProviders } from './storage.provider'

@Module({
  providers: [...storageProviders],
  exports: [...storageProviders],
})
export class StorageModule {}