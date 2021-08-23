data = {
    "schema": {
        "name": 'node.update',
        "mandatory": ["-id"],
        "-id": "oneDimIntVec",     // 1,2,3
        "-radius": "oneDimIntVec", // 1,2,3 has no grouping
        "-pos": "twoDimIntVecs"
    },
    "logic": {
        "name": "nodeUpdate",
        nodeUpdate(parsedData, state) {
            // [1,2]         //-id
            // [1,2]         //-radius
            // [[1,2],[3,4]] //-pos

            //normally we would extract each thing into its own var
            const nodeIds = parsedData['-id'] //this is assured to exist
            const nodeRadius = parsedData['-radius'] || []
            const nodePos = parsedData['-pos'] || []

            //loop over 2d array
            //normally loop over mandatory opts
            for (let i = 0; i < nodeIds.length; i++) {
                let data = {}
                data['-id'] = nodeIds[i]
                data['-radius'] = nodeRadius[i] || "KEEP_UNCHANGED"
                data['-pos'] = nodePos[i] || "KEEP_UNCHANGED"  //if this options is not present,simply skip its effect

                let stateResult = state.pushUpdateNode(data)

                if (stateResult.hasError) return stateResult

            }

            let pushResult = state.executePushed()

            return { 'msg': `Updated ${pushResult.msg.length} nodes` }

        }
    }

}
