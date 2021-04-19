import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { defineModule } from '@/define'

const loadingModule = defineModule({
	namespaced: true,

	state: {
		loadings: {} as Record<string, boolean>
	},

	getters: {
		getLoadingStatesForActions: state => (actions: string | string[]) => {
			if (Array.isArray(actions)) {
                return actions.some(action => state.loadings[action]);
			}
            
            return !!state.loadings[actions];
		}
	},

	mutations: {
		changeLoadingState(state, [action, value]: [action: string, value: boolean]) {
			state.loadings[action] = value;
		},

		resetState(state) {
			state.loadings = {};
		}
	},

    actions: {
        test({ commit }) {
			commit('')
		}
    }
});

const modules= {
    loading: loadingModule
}

Vue.use(Vuex);

const store = new Store({
    modules,
})
