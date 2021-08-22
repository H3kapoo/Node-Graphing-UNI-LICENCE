data = {
    "schema": {
        "name": "node.info",
        "mandatory": [],
    },
    "logic": {
        "name": "nodeInfo",
        nodeInfo(parsedData, state) {
            console.log('ninfo', state.getNodeData())
            const nodeCnt = Object.keys(state.getNodeData()).length // console.log('node info', )
            return {
                "msg": `There are ${nodeCnt} nodes present`
            }
        }
    }
}