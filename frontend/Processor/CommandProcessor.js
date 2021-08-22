//this should poll its commands from some file also
//commands should only return on error with msg
//or on succesfull with success msg
//commands will get executed and applied to state_ one at the time
import { CommandsLogic } from "./CommandsLogic"

//NOTE: this all returns to GraphManager.js step 4
export class CommandProcessor {

    process(graphState, parsedData) {
        //make a check to see if cmd exists
        if (!CommandsLogic[parsedData.cmdName])
            return {
                'hasError': true,
                'msg': "Command '" + parsedData.cmdName + "' exists but has no logic definition,\
                                    did you forget to add it?"
            }
        return CommandsLogic[parsedData.cmdName](parsedData, graphState) //this gets updated by reference!!
    }

    //note: here the user may have defined -example that internally transforms
    //into something like -radius and -color command
    //and thats why at 'pushXY' we always need to verify if the commands are supported
    //for nodes and respectively for conns
    //this assures the user will not try to use any opt that doesnt exist
}