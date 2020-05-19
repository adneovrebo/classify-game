import Vue from 'vue'
import Vuex from 'vuex'
import ml5 from "ml5";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    knn: new ml5.KNNClassifier()
  },
  mutations: {
    clearKnn(state){
      state.knn = new ml5.KNNClassifier()
    }
  },
  actions: {
  },
  modules: {
  }
})
