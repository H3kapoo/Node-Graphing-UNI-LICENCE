data = {
    "schema": {
        "name": 'node.up',
        "mandatory": ["-id"],
        "-id": "N_D_INT_VECS",     // 1,,4,5,2|3 (| defines groups)
        "-radius": "ONE_D_INT_VEC" // 1,2,3 has no grouping
    },
    "logic": {
        "name": "nodeUp",
        nodeUp(parsedData, state) {
            // [[1,2],[3,5,6]] //-id
            // [1,2] //-radius
            const nodeIds2D = parsedData['-id']
            const nodeRadius = parsedData['-radius']

            //loop over 2d array
            for (let i = 0; i < nodeIds2D.length; i++) {
                //loop over els inside array
                for (let el = 0; el < nodeIds2D[i].length; el++) {
                    let data = { ...parsedData }

                    data['-id'] = nodeIds2D[i][el]
                    data['-radius'] = this._va(nodeRadius, i) ? nodeRadius[i] : 100000

                    let stateResult = state.pushUpdateNode(data)

                    if (stateResult.hasError) return stateResult
                }
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
