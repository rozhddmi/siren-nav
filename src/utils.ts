import { Siren, Action } from "siren-types";
import { NavState } from "./state";
import axios from "axios";

import * as debug from "debug";
const debugUtils = debug("siren-nav:utils");

import * as URI from "urijs";
import * as URIT from "urijs/src/URITemplate";

export function getSiren(state: NavState): Promise<Siren> {
    debugUtils("  getSiren for URL '%s' with config: ", state.cur, state.config);
    return Promise.resolve(axios.get(state.cur, state.config)).then(resp => resp.data as Siren);
}

export function normalizeUrl(href: string, base: string | null, parameters?: {}): string {
    const uri = URI(href);
    let url = base ? uri.absoluteTo(base) : uri;
    if (url.is("relative")) throw new Error("Normalized URL is relative: " + url.toString());
    if (parameters) {
        url = URIT(url.toString()).expand(parameters);
        debugUtils("  After expansion with %j, URL became: %s", parameters, url.toString());
    }
    debugUtils("  Absolute URL: %s", url.toString());
    return url.toString();
}

export function formulateData(action: Action, body: {}): {} | string {
    const type = action.type;
    // Is there a type specified other than urlencoded?  If so, we just use body
    if (type && type !== "application/x-www-form-urlencoded") return body;

    // Ensure he body exists and it is an object
    if (!body || typeof body != "object") return body;

    // URL encode field of body.
    return new URI("").search(body).toString();
}
