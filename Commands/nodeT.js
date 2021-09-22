data = {
    "schema": {
        "name": 'node.t',
        "mandatory": ["-pos"],
        "-pos": "twoPositiveNumberVecs",
        "-dt": 'onePositiveNumber',
        "-wait": 'oneString',
        "-ha": 'oneString'

    },
    logic(parsedData, api) { //state observer as last param optional?
        /*extract needed load*/
        const nodePosVecs = parsedData.get('pos')
        const ha = parsedData.get('ha')
        const dt = parsedData.get('dt')
        const wait = parsedData.get('wait')

        /*create 'push' data payload*/
        for (let i = 0; i < nodePosVecs.length; i++) {
            const data = {}

            if (ha[0] === '1') {
                data.pos = [2, 2]
                data.anim = {
                    'awaitable': wait[0] == '1' ? true : false,
                    'duration': 2000, // (ms)
                    'pos': nodePosVecs[i]
                }
            } else {
                data.pos = nodePosVecs[i]
            }

            api.pushCreateNode(data)
        }
    }
}

// data.radius = nodeRadii[i] //this becomes undefined,not needed,clear
