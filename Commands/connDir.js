data = {
    "schema": {
        "name": "conn.dir",
        "mandatory": ["-id"],
        "-id": "twoPositiveNumberVecs",
        '-elev': "positiveNumberVec"
    },
    logic(parsedData, state) {
        let nodeIds = parsedData.get('id')
        let elev = parsedData.get('elev')

        for (let i = 0; i < nodeIds.length; i++) {
            let data = {}
            data.id_src = nodeIds[i][0]
            data.id_dest = nodeIds[i][1]
            data.elev = elev[i]
            data.directed = true

            state.pushCreateConn(data)
        }

        let pushResult = state.executePushed()
        let msg = 'Created conn(s): '

        pushResult.msg.forEach((act, index) => {
            if (act.type == 'createConn') {
                msg += `Id ${act.param.conn_id} between nodeId ${act.param.id_src} and ${act.param.id_dest}`
                if (index < pushResult.msg.length - 1)
                    msg += ', '
            }
        });
        return { msg }
    }
}