import { Module, createStore as cs } from 'vuex-smart-module';
import { SignInModule } from '@/modules/SignInModule';
import { BooksModule } from '@/modules/BooksModule';

export function createStore() {
  const rootModule = new Module({
    modules: {
      SignInModule,
      BooksModule
    }
  });

  return cs(rootModule);
}
