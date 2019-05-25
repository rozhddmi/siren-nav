import { NavState } from "../state";
import { headerConfig } from "../config";
import { Step } from "./step";

export function header(key: string, value: string): Step {
    return async (state: NavState): Promise<NavState> => {
        return new NavState(state.cur, undefined, headerConfig(key, value)(state.currentConfig));
    };
}

export function accept(ctype: string): Step {
    return header("Accept", ctype);
}

export function contentType(ctype: string): Step {
    return header("Content-Type", ctype);
}

export function auth(scheme: string, token: string): Step {
    return header("Authorization", `${scheme} ${token}`);
}
