//NOTE: THIS SHOULD BE MOVED SOMEWHERE WHERE THEN USER CAN ADD NEW CMDS EASILY
//full schema for each command input type
export const CommandsSchemas = {
    "node.make": {
        "mandatory": ["-pos"],
        "-pos": "TWO_D_INT_VECS",    //1,2|3,4 (strictly two of grp length)
        "-type": "ONE_D_STRING_VEC", // str,str
    },
    "node.radial": {
        "mandatory": ["-id", "-origin"], //there must be some mandatory params
        "-id": "N_D_INT_VECS",            //type of data to be fetched must be provided
        "-origin": "TWO_D_INT_VECS",
        "-radius": "ONE_D_INT_VEC",
    },
    "node.up": {
        "mandatory": ['-id'],
        "-id": "N_D_INT_VECS",     // 1,,4,5,2|3 (| defines groups)
        "-radius": "ONE_D_INT_VEC" // 1,2,3 has no grouping
    },
    "node.del": {
        "mandatory": ['-id'],
        "-id": "ONE_D_INT_VEC"    //1,2,3
    },
    "tesst": {
        mandatory: []
    }
}
