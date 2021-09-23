/*File containing the internal node/conns possible states and their types and availability*/

export const SupportedNodeOpts = {
    "radius": { 'active': true, 'type': 'integer' },
    "pos": { 'active': true, 'type': 'intPairVec' },
    "color": { 'active': true, 'type': 'string' },
    "nodeId": { 'active': true, 'type': 'integer' },
    "type": { 'active': true, 'type': 'string' },
    "id": { 'active': true, 'type': 'integer' },
    'shouldWaitForAnim': { 'active': true, 'type': 'boolean' },
    'duration': { 'active': true, 'type': 'integer' },
    "others": { 'active': false, 'type': '?' },
    //..
}

export const SupportedConnOpts = {
    "color": { 'active': true, 'type': 'string' },
    "id": { 'active': true, 'type': 'integer' },
    "conn_id": { 'active': true, 'type': 'integer' },
    "id_src": { 'active': true, 'type': 'integer' },
    "id_dest": { 'active': true, 'type': 'integer' },
    "color": { 'active': true, 'type': 'string' },
    "directed": { 'active': true, 'type': 'boolean' }, //TODO: maybe change those to take only selective strings
    "elev": { 'active': true, 'type': 'integer' }
    //..
}

/*Internal cmds arg validators*/
export const SupportedValidators = {

    boolean(a) {
        return (typeof a === 'boolean')
    },
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