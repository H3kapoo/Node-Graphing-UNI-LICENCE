data = {
    "schema": {
        "name": 'node.t',
        "mandatory": ["-pos"],
        "-pos": "twoPositiveNumberVecs",
        // "-radius": "positiveNumberVec",
        "-dt": 'onePositiveNumber',
        "-wait": 'oneString',

    },
    async logic(parsedData, state) {
        /*extract needed load*/
        const nodePosVecs = parsedData.get('pos')
        const nodeRadii = parsedData.get('radius')
        const dt = parsedData.get('dt')
        const wait = parsedData.get('wait')


        /*create 'push' data payload*/
        for (let i = 0; i < nodePosVecs.length; i++) {
            const data = {}

            data.pos = [2, 2]
            // data.radius = nodeRadii[i] //this becomes undefined,not needed,clear
            data.anim = {
                'shouldWait': wait[0] === '1' ? true : false,
                'dt': dt[0] || 0, //travel duration in ms
                'pos': nodePosVecs[i] //pos target
            }
            console.log('pushed')
            let r = await state.pushCreateNode(data)
            console.log('r', r)

            // console.log('awaited anim: ', data.pos)
        }


        /*to the stdOut with it..*/
        return { "msg": "msg" }
    }
}