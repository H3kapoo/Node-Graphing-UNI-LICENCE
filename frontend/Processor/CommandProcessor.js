//this should poll its commands from some file also
//commands should only return on error with msg
//or on succesfull with success msg
//commands will get executed and applied to state_ one at the time

//NOTE: this all returns to GraphManager.js step 4
export class CommandProcessor {

    process(graphState, parsedData) {
        //make a check to see if cmd exists
        if (!this.commands_[parsedData.cmdName])
            return {
                'hasError': true,
                'msg': "Command '" + parsedData.cmdName + "' exists but has no logic definition,\
                                    did you forget to add it?"
            }

        return this.commands_[parsedData.cmdName](parsedData, graphState)
    }

    //note: here the user may have defined -example that internally transforms
    //into something like -radius and -color command
    //and thats why at 'pushXY' we always need to verify if the commands are supported
    //for nodes and respectively for conns
    //this assures the user will not try to use any opt that doesnt exist
    commands_ = {
        nodeMake(parsedData, state) {
            //here parsedData/copy of can be modified according to the user's needs
            //ALWAYS COPY THINGS FIRST INTO NEW DICT
            //ALWAYS PASS NEW DICT FROM ORIGINAL TO push COMMANDS to avoid unexpected errs

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
        },
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

        },
        nodeDel(parsedData, state) {
            //[1,2,4] //-id
            for (let i of parsedData['-id']) {
                let stateResult = state.pushDeleteNode(i)
                // / eefeff
                if (stateResult.hasError) return stateResult
            }

            let pushResult = state.executePushed()
            let output = ''

            for (let p of pushResult.msg)
                output += p.type + ' '
            //bubble up std output msg
            return { 'msg': output }
        },
        _va(arg, i) {
            if (arg === undefined || i >= arg.length) return undefined
            return arg[i]
        },
    }


}