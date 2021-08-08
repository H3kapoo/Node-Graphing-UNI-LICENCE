//Validate and return values according to cmd schema

export const CommandArgParser = {
    ONE_D_STRING_VEC(arg) {
        //c,b,a
        let splitted = arg.split(',')
        let arr = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',') {
            console.log("Trailing comma is invalid at arg: " + arg)
            return []
        }

        for (let i = 0; i < splitted.length; i++)
            arr.push(splitted[i])

        return arr

    },
    N_D_INT_VECS(arg) {
        //1,2,5,6,..|3,4,4,...|5,6
        let splitted = arg.split('|')
        let arr = []

        for (let i = 0; i < splitted.length; i++) {
            let arr2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',') {
                console.log("Trailing comma is invalid at arg: " + splitted[i])
                return []
            }

            let splitted2 = splitted[i].split(',')

            for (let j = 0; j < splitted2.length; j++) {
                if (!this._isValidInt(splitted2[j])) {
                    console.log(splitted2[j] + " must be an INT in: " + splitted2 + " but it's not")
                    return []
                }
                arr2.push(parseInt(splitted2[j]))
            }
            arr.push(arr2)
        }

        return arr
    },
    TWO_D_INT_VECS(arg) {
        //1,2|3,4|5,6
        let splitted = arg.split('|')
        let arr = []

        for (let i = 0; i < splitted.length; i++) {
            let arr2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',') {
                console.log("Trailing comma is invalid at arg: " + splitted[i])
                return []
            }

            let splitted2 = splitted[i].split(',')

            if (splitted2.length !== 2) {
                console.log("Argument must be 2D pair but its not: " + splitted[i])
                return []
            }

            if (!this._isValidInt(splitted2[0])) {
                console.log(splitted2[0] + " must be an INT in: " + splitted[i] + " but it's not")
                return []
            }

            if (!this._isValidInt(splitted2[1])) {
                console.log(splitted2[1] + " must be an INT in: " + splitted[i] + " but it's not")
                return []
            }
            arr2.push(parseInt(splitted2[0]), parseInt(splitted2[1]))
            arr.push(arr2)
        }
        return arr

    },
    ONE_D_INT_VEC(arg) {
        //1,2,3
        let splitted = arg.split(',')
        let arr = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',') {
            console.log("Trailing comma is invalid at arg: " + arg)
            return []
        }

        for (let i = 0; i < splitted.length; i++) {

            if (!this._isValidInt(splitted[i])) {
                console.log(splitted[i] + " must be an INT in: " + arg + " but it's not")
                return []
            }
            arr.push(parseInt(splitted[i]))
        }

        return arr

    },
    _isValidInt(arg) {
        return !isNaN(arg) && !isNaN(parseInt(arg))
    }
}