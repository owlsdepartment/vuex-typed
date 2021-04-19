import { ActionContext } from "@/typings";
import { TestGetters } from "./getters";
import { TestMutations } from "./mutations";
import { TestState } from "./state";

type Ctx = ActionContext<TestState, TestGetters, TestMutations>

const actions = {
    testAction({}: Ctx, payload: number | null): void {}
}

export default actions;
