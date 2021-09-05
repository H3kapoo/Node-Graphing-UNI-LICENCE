data = {
    "schema": {
        "name": 'node.update',
        "mandatory": ["-id"],
        "-id": "positiveNumberVec",
        "-radius": "positiveNumberVec",
        "-pos": "twoPositiveNumberVecs",
        "-color": "stringVec"
    },
    logic(parsedData, state) {
        {
            // /*extract needed load*/
            // const nodeIdsVec = parsedData.get('id')
            // const nodeRadii = parsedData.get('radius')
            // const nodeColors = parsedData.get('color')
            // const nodePos = parsedData.get('pos')

            // /*create 'push' data payload*/
            // for (let i = 0; i < nodeIdsVec.length; i++) {
            //     let data = {}
            //     data['-id'] = this.set(nodeIdsVec[i])
            //     data['-pos'] = this.set(nodePos[i])
            //     data['-color'] = this.set(nodeColors[i])
            //     data['-radius'] = this.set(nodeRadii[i])

            //     let stateResult = state.pushUpdateNode(data)
            //     if (stateResult.hasError) return stateResult
            // }

            // let pushResult = state.executePushed()

            // let msg = 'Updated node(s): '

            // pushResult.msg.forEach((act, index) => {
            //     if (act.type == 'updateNode') {
            //         let nId = act.param['-node_id']
            //         let nPos = act.param['-pos']
            //         let nRad = act.param['-radius']
            //         let nColor = act.param['-color']

            //         msg += `Id=${nId}`
            //         msg += nPos ? ` with pos=(${nPos[0]},${nPos[1]})` : ``
            //         msg += nRad ? ` with radius=${nRad}` : ``
            //         msg += nColor ? ` with color=${nColor}` : ``

            //         if (index < pushResult.msg.length - 1)
            //             msg += ', '
            //     }
            // });

            // return { msg }

        }
    }
}
