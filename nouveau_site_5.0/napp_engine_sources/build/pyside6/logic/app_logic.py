# --- Auto-generated NaCode Logic ---
import sys
from napp_runtime import gs


# --- Global Functions ---
def main():
    gs.var_set(name="active_filter", value="all")
    gs.var_set(name="search_query", value="")
def set_filter(filter):
    gs.var_set(name="active_filter", value=filter)
def update_search(query):
    gs.var_set(name="search_query", value=query)
def matches_search(name_en, name_fr):
    q = str(gs.var_get(name="search_query", default_value="")).lower()
    if (q == ""):
        return True
    return ((q in str(str(name_en).lower())) or (q in str(str(name_fr).lower())))