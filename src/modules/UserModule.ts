import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Users } from '@/model/Users';

class UserState {}

class UserGetters extends Getters<UserState> {
  get getUserList() {
    return Users.list;
  }
}

class UserMutations extends Mutations<UserState> {}

class UserActions extends Actions<
  UserState,
  UserGetters,
  UserMutations,
  UserActions
> {}

export const UserModule = new Module({
  state: UserState,
  getters: UserGetters,
  mutations: UserMutations,
  actions: UserActions
});
