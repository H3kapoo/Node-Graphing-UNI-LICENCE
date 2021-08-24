data = {
    "schema": {
        "name": "conn.undir",
        "mandatory": ["-id"],
        "-id": "twoDimIntVecs"
    },
    "logic": {
        "name": "connUndir",
        connUndir(parsedData, state) {
            let ids = parsedData['-id']

            for (let i = 0; i < ids.length; i++) {
                let data = {}
                data['-id_src'] = ids[i][0]
                data['-id_dest'] = ids[i][1]

                let stateResult = state.pushCreateConn(data)

                if (stateResult.hasError) return stateResult
            }

            let pushResult = state.executePushed()
            let msg = 'Created conn(s): '

            pushResult.msg.forEach((act, index) => {
                if (act.type == 'createConn') {
                    msg += 'id ' + act.opts['-conn_id'] + ' between id ' + act.opts['-id_src'] + ' and ' + act.opts['-id_dest']
                    if (index < pushResult.msg.length - 1)
                        msg += ', '
                }
            });
            return { msg }
        }
    }
}