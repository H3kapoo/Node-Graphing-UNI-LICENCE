data = {
    "schema": {
        "name": 'node.del',
        "mandatory": ["-id"],
        "-id": "ONE_D_INT_VEC"    //1,2,3
    },
    "logic": {
        "name": "nodeDel",
        nodeDel(parsedData, state) {
            //[1,2,4] //-id
            for (let i of parsedData['-id']) {
                let stateResult = state.pushDeleteNode(i)

                if (stateResult.hasError) return stateResult
            }

            let pushResult = state.executePushed()
            let output = ''

            for (let p of pushResult.msg)
                output += p.type + ' '
            //bubble up std output msg
            return { 'msg': output }
        }
    }

}
