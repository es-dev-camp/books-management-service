import { Module, createStore as cs } from 'vuex-smart-module';
import { SignInModule } from '@/modules/SignInModule';
import { BooksModule } from '@/modules/BooksModule';
import { AuditModule } from '@/modules/AuditModule';

export function createStore() {
  const rootModule = new Module({
    modules: {
      SignInModule,
      BooksModule,
      AuditModule
    }
  });

  return cs(rootModule);
}
