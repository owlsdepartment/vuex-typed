import { TestState } from "./state";

const mutations = {
	notificationListReset(state: TestState, { name }: { name: string }) {
        state.lists = {};
	},
};

export type TestMutations = typeof mutations;

export default mutations;
