import {
  Getters,
  Mutations,
  Actions,
  Module,
  createMapper,
} from 'vuex-smart-module';
import * as booksManagementEvent from '@common/booksManagementEvent';
import Audit from '@/model/Audit';

class AuditState {
  bookEventList: booksManagementEvent.bookEvent[] = new Array<booksManagementEvent.bookEvent>();
}

class AuditGetters extends Getters<AuditState> {
  get getBookEventList() {
    return this.state.bookEventList;
  }
}

class AuditMutations extends Mutations<AuditState> {
  async updateBookEventList() {
    this.state.bookEventList = await Audit.GetBookEventList();
  }
}

class AuditActions extends Actions<
  AuditState,
  AuditGetters,
  AuditMutations,
  AuditActions
> {
  updateBookEventList() {
    this.commit('updateBookEventList');
  }
}

export const AuditModule = new Module({
  state: AuditState,
  getters: AuditGetters,
  mutations: AuditMutations,
  actions: AuditActions,
});

export const AuditMapper = createMapper(AuditModule);
