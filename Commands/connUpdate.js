data = {
    "schema": {
        "name": "conn.update",
        "mandatory": ["-id"],
        "-id": "oneDimIntVec",
        "-color": "oneDimStringVec"
    },
    "logic": {
        "name": "connUpdate",
        connUpdate(parsedData, state) {
            let ids = parsedData['-id']
            let color = parsedData['-color'] || []

            for (let i = 0; i < ids.length; i++) {
                let data = {}
                data['-id'] = ids[i]
                data['-color'] = color[i] || "KEEP_UNCHANGED"

                let stateResult = state.pushUpdateConn(data)

                if (stateResult.hasError) return stateResult
            }

            let pushResult = state.executePushed()
            let msg = 'Updated conn(s): '

            pushResult.msg.forEach((act, index) => {
                if (act.type == 'updateConn') {
                    msg += 'id ' + act.opts['-conn_id'] + ' between id ' + act.opts['-id_src'] + ' and ' + act.opts['-id_dest']
                    if (index < pushResult.msg.length - 1)
                        msg += ', '
                }
            });
            return { msg }
        }
    }
}