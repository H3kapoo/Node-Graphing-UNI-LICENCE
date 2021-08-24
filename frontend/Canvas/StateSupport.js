//file containing the internal node/conns possible states and their types

//opts the node can have and the RENDERER can ultimately make use of
export const SupportedNodeOpts = {
    "-radius": { 'active': true, 'type': 'integer' },
    "-pos": { 'active': true, 'type': 'intPairVec' },
    "-color": { 'active': true, 'type': 'string' },
    "-node_id": { 'active': true, 'type': 'integer' },
    "-type": { 'active': true, 'type': 'string' },
    "-id": { 'active': true, 'type': 'integer' },
    "-others": { 'active': false, 'type': '?' },
    //..
}

export const SupportedConnOpts = {
    "-color": { 'active': true, 'type': 'string' },
    "-id_src": { 'active': true, 'type': 'integer' },
    "-id_dest": { 'active': true, 'type': 'integer' },
    //..
}

//internal cmds arg validators
export const SupportedValidators = {
    string(a) {
        return (typeof a === 'string')
    },
    integer(a) {
        return !isNaN(a) && !isNaN(parseInt(a))
    },
    intPairVec(a) {
        if (a.length !== 2) return false

        return !isNaN(a[0]) && !isNaN(parseInt(a[0])) &&
            !isNaN(a[1]) && !isNaN(parseInt(a[1]))
    }
}