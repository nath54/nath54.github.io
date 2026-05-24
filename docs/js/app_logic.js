"use strict";

// --- Classes ---

// --- Global Functions ---
function main() {
    gs.var_set({name: "active_filter", value: "all"});
    gs.var_set({name: "search_query", value: ""});
}
function set_filter(filter) {
    gs.var_set({name: "active_filter", value: filter});
}
function update_search(query) {
    gs.var_set({name: "search_query", value: query});
}
function matches_search(name_en, name_fr) {
    let q = (gs.var_get({name: "search_query", default_value: ""})).toLowerCase();
    if ((q === "")) {
        return true;
    }
    return (((name_en).toLowerCase()).includes(q) || ((name_fr).toLowerCase()).includes(q));
}