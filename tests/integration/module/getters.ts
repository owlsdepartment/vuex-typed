import { TestState } from './state'

const getters = {
	getNotificationById: (state: TestState) => (id: string): any =>
		state.tests[id],
};

export type TestGetters = typeof getters;

export default getters;
