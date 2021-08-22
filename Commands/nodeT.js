//TEST COMMAND
data = {
    "schema": {
        "name": 'node.t',
        "mandatory": ["-id"],
        "-id": "nDimIntVecs",     // 1,,4,5,2|3 (| defines groups)
        "-color": "oneDimStringVec" // c,a,b has no grouping
    },
    "logic": {
        "name": "nodeT",
        nodeT(parsedData, state) {
            // console.log(parsedData)
            // console.log('Logs from nodeT.')
            // for (let [k, d] of Object.entries(parsedData))
            //     console.log(k, d)
            // // let pushResult = state.executePushed()
            // console.log('pushing node create')
            // let pushResult = state.pushCreateNode(parsedData)
            // if (pushResult.hasError) return pushResult //this contains the error

            return { 'msg': parsedData }

        }
    }

}
