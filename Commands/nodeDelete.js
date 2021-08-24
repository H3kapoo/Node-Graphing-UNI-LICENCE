data = {
    "schema": {
        "name": 'node.delete',
        "mandatory": ["-id"],
        "-id": "oneDimIntVec"    //1,2,3
    },
    "logic": {
        "name": "nodeDelete",
        nodeDelete(parsedData, state) {
            //[1,2,4] //-id
            for (let i of parsedData['-id']) {

                let stateResult = state.pushDeleteNode(i)

                if (stateResult.hasError) return stateResult
            }

            let pushResult = state.executePushed()

            let msg = 'Deleted node id(s): ' + parsedData['-id'].toString()

            return { msg }
        }
    }

}
