data = {
    "schema": {
        "name": 'node.up',
        "mandatory": ["-id"],
        "-id": "oneDimIntVec",     // 1,2,3
        "-radius": "oneDimIntVec" // 1,2,3 has no grouping
    },
    "logic": {
        "name": "nodeUp",
        nodeUp(parsedData, state) {
            // [1,2] //-id
            // [1,2] //-radius

            //normally we would extract each thing into its own var
            const nodeIds = parsedData['-id'] //this is assured to exist
            const nodeRadius = parsedData['-radius'] || []

            //loop over 2d array
            //normally loop over mandatory opts
            for (let i = 0; i < nodeIds.length; i++) {
                let data = {}
                data['-id'] = nodeIds[i]
                data['-radius'] = nodeRadius[i] || [] //empty to trigger error, fill for default

                let stateResult = state.pushUpdateNode(data)

                if (stateResult.hasError) return stateResult

            }

            let pushResult = state.executePushed()

            return { 'msg': `Updated ${pushResult.msg.length} nodes` }

        }
    }

}
