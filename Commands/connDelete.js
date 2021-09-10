data = {
    "schema": {
        "name": 'conn.delete',
        "mandatory": ["-id"],
        "-id": "positiveNumberVec"
    },
    logic(parsedData, state) {

        for (let connId of parsedData.get('id'))
            state.pushDeleteConn(connId)

        let pushResult = state.executePushed()

        let msg = pushResult.msg.length ? 'Deleted conn(s): ' : 'Success, but nothing pushed for execution!'

        pushResult.msg.forEach((act, index) => {
            if (act.type == 'deleteConn') {
                let nId = act.param.conn_id

                msg += `Id=${nId}`
                if (index < pushResult.msg.length - 1)
                    msg += ', '
            }
        })
        return { msg }
    }
}
