data = {
    "schema": {
        "name": 'node.t',
        "mandatory": ["-pos"],
        "-pos": "twoPositiveNumberVecs",
        "-dt": 'onePositiveNumber',
        "-wait": 'oneString',
        "-ha": 'oneString'

    },
    async logic(parsedData, state) {
        /*extract needed load*/
        const nodePosVecs = parsedData.get('pos')
        const ha = parsedData.get('ha')
        const dt = parsedData.get('dt')
        const wait = parsedData.get('wait')

        /*create 'push' data payload*/
        for (let i = 0; i < nodePosVecs.length; i++) {
            const data = {}

            data.anim = {
                'awaitable': true,
                'duration': 2000, // (ms)
                'option_to_animate': target_value
            }

            if (ha[0] === '1') {
                data.pos = [2, 2]
                data.anim = {
                    'awaitable': true,
                    'duration': 2000, // (ms)
                    'option_to_animate': target_value
                }
            } else {
                data.pos = nodePosVecs[i]
            }

            console.log('pushed')
            let r = await state.pushCreateNode(data)
            console.log('awaited anim: ', r)
        }

        /*to the stdOut with it..*/
        return { "msg": "msg" }
    }
}

            // data.radius = nodeRadii[i] //this becomes undefined,not needed,clear
