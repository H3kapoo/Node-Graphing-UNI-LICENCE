//TEST COMMAND
data = {
    "schema": {
        "name": 'node.t',
        "mandatory": [],
        "-a": "oneString",
        "-b": "onePositiveInt",
        "-c": "oneNumberInt",
        "-d": "twoString",
        "-e": "twoPositiveInt",
        "-f": "twoNumberInt",
        "-g": "stringVec",
        "-h": "positiveIntVec",
        "-i": "numberIntVec",
        "-j": "twoStringVecs",
        "-k": "twoPositiveIntVecs",
        "-l": "twoNumberIntVecs",
        "-m": "stringVecs",
        "-n": "positiveIntVecs",
        "-o": "numberIntVecs",
    },
    "logic": {
        "name": "nodeT",
        nodeT(parsedData, state) {
            return { 'msg': "pass" }

        }
    }

}
