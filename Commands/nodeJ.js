data = {
    "schema": {
        "name": 'node.j',
        "mandatory": ["-pos", "-id"],
        "-id": "positiveNumberVec",
        "-pos": "twoPositiveNumberVecs",
        "-dt": 'onePositiveNumber',
        "-wait": 'oneString',
        "-ha": 'oneString'

    },
    logic(parsedData, api) { //state observer as last param optional?
        /*extract needed load*/
        const nodePosVecs = parsedData.get('pos')
        const ids = parsedData.get('id')
        const ha = parsedData.get('ha')
        const dt = parsedData.get('dt')
        const wait = parsedData.get('wait')

        /*create 'push' data payload*/
        for (let i = 0; i < ids.length; i++) {
            const data = {}
            data.id = ids[i]

            if (ha[0] === '1') {
                data.anim = {
                    'awaitable': wait[0] == '1' ? true : false,
                    'duration': 4000, // (ms)
                    'pos': nodePosVecs[0]
                }
            } else {
                data.pos = nodePosVecs[0]
            }

            api.pushUpdateNode(data)
        }
    }
}

// data.radius = nodeRadii[i] //this becomes undefined,not needed,clear
