class nodeMake {
    schema = {
        "node.make": {
            "mandatory": ["-pos"],
            "-pos": "TWO_D_INT_VECS",    //1,2|3,4 (strictly two of grp length)
            "-type": "ONE_D_STRING_VEC", // str,str
        }
    }

    nodeMake(parsedData, state) {

        const nodePosVecs = parsedData['-pos']
        const nodeTypes = parsedData['-type']

        for (let i = 0; i < nodePosVecs.length; i++) {
            let data = { ...parsedData }
            data['-pos'] = this._va(nodePosVecs, i)
            data['-type'] = this._va(nodeTypes, i) ? nodeTypes[i] : 'round'

            let stateResult = state.pushCreateNode(data)

            if (stateResult.hasError) return stateResult
        }

        //at this point,this is guaranteed not to throw errors
        //it returns the updates done as {} , can be used to
        //format a pretty output
        let pushResult = state.executePushed()

        //bubble up std output msg
        let output = ''

        for (let p of pushResult.msg)
            output += p.type + ': OK '
        //bubble up std output msg
        return { 'msg': output }
    }
}