data = {
    "schema": {
        "name": "node.info",
        "mandatory": [],
        "-elev": "oneNumberInt"
    },
    "logic": {
        "name": "nodeInfo",
        nodeInfo(parsedData, state) {
            let elev = this.get(parsedData, '-elev')
            let data = {}

            data['-elev'] = this.set(elev[0])

            let pushResult = state.pushCreateNode(data)
            if (pushResult.hasError) return pushResult

            const nodeCnt = Object.keys(state.getNodeData()).length // console.log('node info', )
            return {
                "msg": `There are ${nodeCnt} nodes present`
            }
        }
    }
}