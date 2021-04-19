const state = () => ({
	tests: {} as Record<string, any>,
	lists: {} as Record<string, any>,
});

export type TestState = ReturnType<typeof state>;

export default state;
