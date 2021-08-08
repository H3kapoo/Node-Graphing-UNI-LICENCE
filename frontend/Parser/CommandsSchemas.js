//NOTE: THIS SHOULD BE MOVED SOMEWHERE WHERE THEN USER CAN ADD NEW CMDS EASILY
//full schema for each command input type
export const CommandsSchemas = {
    "node.make": {
        "mandatory": ["-pos"],
        "-pos": "TWO_D_INT_VECS",
        "-type": "ONE_D_STRING_VEC",
    },
    "node.radial": {
        "mandatory": ["-id", "-origin"], //there must be some mandatory params
        "-id": "N_D_INT_VECS",            //type of data to be fetched must be provided
        "-origin": "TWO_D_INT_VECS",
        "-radius": "ONE_D_INT_VEC",
    },
}
