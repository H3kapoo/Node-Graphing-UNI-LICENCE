data = {
    "schema": {
        "name": 'node.delete',
        "mandatory": ["-id"],
        "-id": "positiveNumberVec"
    },
    logic(parsedData, state) {

        for (let nodeId of parsedData.get('id'))
            state.pushDeleteNode(nodeId)

        let pushResult = state.executePushed()

        let msg = pushResult.msg.length ? 'Deleted node(s): ' : 'Success, but nothing pushed for execution!'

        pushResult.msg.forEach((act, index) => {
            if (act.type == 'deleteNode') {
                let nId = act.param.node_id

                msg += `Id=${nId}`
                if (index < pushResult.msg.length - 1)
                    msg += ', '
            }
        })
        return { msg }
    }
}
