data = {
    "schema": {
        "name": 'node.make',
        "mandatory": ["-pos"],
        "-pos": "twoPositiveNumberVecs",
        "-radius": "positiveNumberVec",
    },
    logic(parsedData, state) {

        /*extract needed load*/
        const nodePosVecs = parsedData.get('pos')
        const nodeRadii = parsedData.get('radius')

        /*create 'push' data payload*/
        for (let i = 0; i < nodePosVecs.length; i++) {
            let data = {}

            data.pos = nodePosVecs[i]
            data.radius = nodeRadii[i]

            state.pushCreateNode(data)
        }

        /*execute the pushed commands*/
        const pushResult = state.executePushed()

        /*optional,let's assure something got executed + */
        /*optional,but nice,prepare an output for success*/
        let msg = pushResult.msg.length ? 'Created node(s): ' : 'Success, but nothing pushed for execution!'

        pushResult.msg.forEach((act, index) => {
            if (act.type == 'createNode') {
                let nId = act.opts.node_id
                let nPos = act.opts.pos
                let nRad = act.opts.radius

                msg += `Id=${nId} at (${nPos[0]},${nPos[1]})`
                msg += nRad ? ` with radius=${nRad}` : ``

                if (index < pushResult.msg.length - 1)
                    msg += ', '
            }
        })

        /*to the stdOut with it..*/
        return { msg }
    }
}