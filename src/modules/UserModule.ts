import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import User from '@/model/User';
import IUser from '@/model/IUser';

class UserState {
  userList: IUser[] = new Array<IUser>();
}

class UserGetters extends Getters<UserState> {
  get getUserList() {
    return this.state.userList;
  }
}

class UserMutations extends Mutations<UserState> {
  async updateUserList(_: any) {
    this.state.userList = await User.GetUserList();
  }
}

class UserActions extends Actions<
  UserState,
  UserGetters,
  UserMutations,
  UserActions
> {
  async updateUserList() {
    await this.commit('updateUserList', null);
  }
}

export const UserModule = new Module({
  state: UserState,
  getters: UserGetters,
  mutations: UserMutations,
  actions: UserActions
});
