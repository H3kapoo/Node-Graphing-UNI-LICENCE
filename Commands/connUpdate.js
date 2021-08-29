data = {
    "schema": {
        "name": "conn.update",
        "mandatory": ["-id"],
        "-id": "oneDimIntVec",
        "-color": "oneDimStringVec",
        "-elev": "oneDimIntVec"
    },
    "logic": {
        "name": "connUpdate",
        connUpdate(parsedData, state) {
            let ids = this.get(parsedData, '-id')
            let color = this.get(parsedData, '-color')
            let elev = this.get(parsedData, '-elev')

            for (let i = 0; i < ids.length; i++) {
                let data = {}
                data['-id'] = this.set(ids[i])
                data['-color'] = this.set(color[i])
                data['-elev'] = this.set(elev[i])
                console.log(data['-elev'])

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