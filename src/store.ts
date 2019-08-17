import { Module, createStore as cs } from 'vuex-smart-module';
import { SignInModule } from '@/modules/SignInModule';
import { BooksModule } from '@/modules/BooksModule';
import { AuditModule } from '@/modules/AuditModule';
import { UserModule } from '@/modules/UserModule';

export function createStore() {
  const rootModule = new Module({
    modules: {
      SignInModule,
      BooksModule,
      AuditModule,
      UserModule
    }
  });

  return cs(rootModule);
}
