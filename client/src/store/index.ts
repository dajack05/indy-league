import { createStore } from 'vuex';
import { state } from './State';
import { mutations } from './Mutations';
import { actions } from './Actions';

export default createStore({
  state,
  mutations,
  actions,
  modules: {
  },
});
