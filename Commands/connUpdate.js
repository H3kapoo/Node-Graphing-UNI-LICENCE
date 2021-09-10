data = {
    "schema": {
        "name": "conn.update",
        "mandatory": ["-id"],
        "-id": "positiveNumberVec",
        "-color": "stringVec",
        "-elev": "positiveNumberVec"
    },
    logic(parsedData, state) {
        let nodeIds = parsedData.get('id')
        let color = parsedData.get('color')
        let elev = parsedData.get('elev')

        for (let i = 0; i < nodeIds.length; i++) {
            let data = {}
            data.id = nodeIds[i]
            data.color = color[i]
            data.elev = elev[i]

            state.pushUpdateConn(data)
        }

        let pushResult = state.executePushed()
        let msg = 'Updated conn(s): '

        pushResult.msg.forEach((act, index) => {
            if (act.type == 'updateConn') {
                msg += `Id ${act.param.conn_id}`
                if (index < pushResult.msg.length - 1)
                    msg += ', '
            }
        });
        return { msg }
    }
}