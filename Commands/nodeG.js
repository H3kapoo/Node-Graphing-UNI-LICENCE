data = {
    "schema": {
        "name": 'node.g',
        "mandatory": ["-id", "-pos"],
        "-pos": "twoPositiveNumberVecs",
        "-id": "positiveNumberVec",
        "-dt": 'onePositiveNumber',
        "-wait": 'oneString',
        "-ha": 'oneString'
    },
    logic(parsedData, api) {

        const nodePosVecs = parsedData.get('pos')
        const ha = parsedData.get('ha')
        const dt = parsedData.get('dt')
        const wait = parsedData.get('wait')

        for (let nodeId of parsedData.get('id')) {
            const data = {}
            data.id = nodeId

            if (ha[0] === '1') {
                data.anim = {
                    'awaitable': wait[0] == '1' ? true : false,
                    'duration': 4000, // (ms)
                    'pos': nodePosVecs[0]
                }
            }
            api.pushDeleteNode(data)
        }
    }
}
