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
    //and thats why at 'push' we always need to verify if the commands are supported
    //for nodes and respectively for conns
    //this assumes the user will not try to use any opt that doesnt exist
    //currently in parsedData,the errors generated wont be catched here,not now
    commands_ = {
        nodeMake(parsedData, state) {
            //here parsedData can be modified according to the user's needs
            //this will make use of state.pushCreateNode({opts})

            let nodePosVecs = parsedData['-pos']

            for (let pos of nodePosVecs) {
                parsedData['-pos'] = pos

                let stateResult = state.pushCreateNode(parsedData)

                if (stateResult.hasError) return stateResult
            }

            //at this point,this is guaranteed not to throw errors
            //it returns the updates done as {} , can be used to
            //format a pretty output
            let pushResult = state.executePushed()

            //bubble up std output msg
            return { 'msg': pushResult.msg }
        },
        otherCmd(parsedData, state) { /* Impl */ }
    }


}