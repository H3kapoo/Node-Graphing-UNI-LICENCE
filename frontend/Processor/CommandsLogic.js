/*Commands loaded will be populated in here, some helper functions already live here*/
export let CommandsLogic = {
    get(po, opt) {
        if (po[opt])
            return po[opt]
        return []
    },
    set(val, fallback = "KEEP_UNCHANGED") {
        if (val === undefined) return fallback
        return val
    }
}