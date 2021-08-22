data = {
    "schema": {
        "name": 'node.make',
        "mandatory": ["-pos"],
        "-pos": "twoDimIntVecs",    //1,2|3,4 (strictly two of grp length)
        "-radius": "oneDimIntVec", // str,str
    },
    "logic": {
        "name": "nodeMake",
        nodeMake(parsedData, state) {

            const nodePosVecs = parsedData['-pos']
            const nodeTypes = parsedData['-radius'] || []

            for (let i = 0; i < nodePosVecs.length; i++) {
                let data = { ...parsedData } //copy cus js reference sucks
                data['-pos'] = nodePosVecs[i]
                data['-radius'] = nodeTypes[i] || 30 //empty for error, put int for default val

                let stateResult = state.pushCreateNode(data) //error and msg if any

                if (stateResult.hasError) return stateResult
            }

            //at this point,this is guaranteed not to throw errors
            //it returns the updates done as {} , can be used to
            //format a pretty output
            let pushResult = state.executePushed()


            return { 'msg': `Created ${pushResult.msg.length} nodes` }
        }
    }
}
