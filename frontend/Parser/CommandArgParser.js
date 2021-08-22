export const CommandArgParser = {
    //N_D_STRING_VECS - Todo a,b,c|d,g,e|...
    oneDimStringVec(arg) {
        //c,b,a
        let splitted = arg.split(',')
        let arr = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',')
            return {
                "hasError": true,
                "msg": "Trailing comma is invalid at arg: " + arg
            }

        for (let i = 0; i < splitted.length; i++)
            arr.push(splitted[i])

        return arr
    },
    nDimIntVecs(arg) {
        //1,2,5,6,..|3,4,4,...|5,6
        let splitted = arg.split('|')
        let arr = []

        for (let i = 0; i < splitted.length; i++) {
            let arr2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                return {
                    "hasError": true,
                    "msg": "Trailing comma is invalid at arg: " + splitted[i]
                }

            let splitted2 = splitted[i].split(',')

            for (let j = 0; j < splitted2.length; j++) {
                if (!this._isValidInt(splitted2[j]))
                    return {
                        "hasError": true,
                        "msg": splitted2[j] + " must be an INT in: " + splitted2 + " but it's not"
                    }
                arr2.push(parseInt(splitted2[j]))
            }
            arr.push(arr2)
        }
        return arr
    },
    twoDimIntVecs(arg) {
        //1,2|3,4|5,6
        let splitted = arg.split('|')
        let arr = []

        for (let i = 0; i < splitted.length; i++) {
            let arr2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                return {
                    "hasError": true,
                    "msg": "Trailing comma is invalid at arg: " + splitted[i]
                }

            let splitted2 = splitted[i].split(',')

            if (splitted2.length !== 2)
                return {
                    "hasError": true,
                    "msg": "Argument must be 2D pair but its not: " + splitted[i]
                }

            if (!this._isValidInt(splitted2[0]))
                return {
                    "hasError": true,
                    "msg": splitted2[0] + " must be an INT in: " + splitted[i] + " but it's not"
                }

            if (!this._isValidInt(splitted2[1]))
                return {
                    "hasError": true,
                    "msg": splitted2[1] + " must be an INT in: " + splitted[i] + " but it's not"
                }

            arr2.push(parseInt(splitted2[0]), parseInt(splitted2[1]))
            arr.push(arr2)
        }
        return arr
    },
    oneDimIntVec(arg) {
        //1,2,3
        let splitted = arg.split(',')
        let arr = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',')
            return {
                "hasError": true,
                "msg": "Trailing comma is invalid at arg: " + arg
            }

        for (let i = 0; i < splitted.length; i++) {

            if (!this._isValidInt(splitted[i]))
                return {
                    "hasError": true,
                    "msg": splitted[i] + " must be an INT in: " + arg + " but it's not"
                }
            arr.push(parseInt(splitted[i]))
        }
        return arr
    },
    _isValidInt(arg) {
        return !isNaN(arg) && !isNaN(parseInt(arg))
    }
}