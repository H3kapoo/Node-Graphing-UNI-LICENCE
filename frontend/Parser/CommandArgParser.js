/*User argument validators/parsers*/
//INFO: thrown erros bubble up to command parser -> graph manager

export const CommandArgParser = {

    //example: a
    oneString(arg) {
        if (this.stringVec(arg).length === 1)
            return this.stringVec(arg)
        else
            throw {
                'stage': '[Parse]',
                "msg": `Schema type doesn't accept multiple string values! Only one!`
            }
    },

    //example: 1
    onePositiveNumber(arg) {
        let res = this.positiveNumberVec(arg)
        if (res)
            return res
        else if (res.length === 1)
            return res
        else
            throw {
                'stage': '[Parse]',
                "msg": `Schema type doesn't accept multiple positive int values! Only one!`
            }
    },

    //example: -3
    oneNumber(arg) {
        let res = this.numberVec(arg)
        if (res)
            return res
        else if (res.length === 1)
            return res
        else
            throw {
                'stage': '[Parse]',
                "msg": `Schema type doesn't accept multiple positive int values! Only one!`
            }
    },

    //example: a,b
    twoString(arg) {
        if (this.stringVec(arg).length === 2)
            return this.stringVec(arg)
        else
            throw {
                'stage': '[Parse]',
                "msg": `Argument type must be string pair but it's not in ${arg} !`
            }
    },

    //example: 1,2
    twoPositiveNumber(arg) {
        let res = this.positiveNumberVec(arg)
        if (res)
            return res
        else if (res.length === 2)
            return res
        else
            throw {
                'stage': '[Parse]',
                "msg": `Argument type must be positive int pair but it's not in ${arg}`
            }
    },

    //example: -3,2
    twoNumber(arg) {
        let res = this.numberVec(arg)
        if (res)
            return res
        else if (res.length === 2)
            return res
        else
            throw {
                'stage': '[Parse]',
                "msg": `Argument type must be int pair but it's not in ${arg}`
            }
    },

    //example: a,b,c,...
    stringVec(arg) {

        let splitted = arg.split(',')
        let res = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',')
            throw {
                'stage': '[Parse]',
                "msg": `Trailing comma is invalid at arg: ${arg} !`
            }

        for (let i = 0; i < splitted.length; i++)
            res.push(splitted[i])

        return res
    },

    //example: 1,2,3,...
    positiveNumberVec(arg) {
        let splitted = arg.split(',')
        let res = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',')
            throw {
                'stage': '[Parse]',
                "msg": `Trailing comma is invalid at arg: ${arg} !`
            }

        for (let i = 0; i < splitted.length; i++) {
            if (!this._isValidPositiveInt(splitted[i]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted[i]} must be a positive integer in: ${arg} but it's not!`
                }
            res.push(parseFloat(splitted[i]))
        }
        return res
    },

    //example: -1,2,-9,...
    numberVec(arg) {
        let splitted = arg.split(',')
        let res = []

        if (arg[0] === ',' || arg[arg.length - 1] === ',')
            throw {
                'stage': '[Parse]',
                "msg": `Trailing comma is invalid at arg: ${arg} !`
            }

        for (let i = 0; i < splitted.length; i++) {
            if (!this._isValidInt(splitted[i]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted[i]} must be an integer in: ${arg} but it's not!`
                }
            res.push(parseFloat(splitted[i]))
        }
        return res
    },

    //example: a,b|c,d|...
    twoStringVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            if (splitted2.length !== 2)
                throw {
                    'stage': '[Parse]',
                    "msg": `Argument must be string pair but its not: ${splitted[i]}`
                }

            res2.push(splitted2[0], splitted2[1])
            res.push(res2)
        }
        return res
    },

    //example: a,b|c,d|...
    twoPositiveNumberVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            if (splitted2.length !== 2)
                throw {
                    'stage': '[Parse]',
                    "msg": `Argument must be int pair but its not: ${splitted[i]}`
                }

            if (!this._isValidPositiveInt(splitted2[0]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted2[0]} must be a positive Int in: ${splitted[i]} but it's not!`
                }

            if (!this._isValidPositiveInt(splitted2[1]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted2[1]} must be a positive Int in: ${splitted[i]} but it's not!`
                }

            res2.push(parseFloat(splitted2[0]), parseFloat(splitted2[1]))
            res.push(res2)
        }
        return res
    },

    //example: 1,2|3,4|...
    twoNumberVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            if (splitted2.length !== 2)
                throw {
                    'stage': '[Parse]',
                    "msg": `Argument must be int pair but its not: ${splitted[i]}`
                }

            if (!this._isValidInt(splitted2[0]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted2[0]} must be an Int in: ${splitted[i]} but it's not!`
                }

            if (!this._isValidInt(splitted2[1]))
                throw {
                    'stage': '[Parse]',
                    "msg": `${splitted2[1]} must be an Int in: ${splitted[i]} but it's not!`
                }

            res2.push(parseFloat(splitted2[0]), parseFloat(splitted2[1]))
            res.push(res2)
        }
        return res
    },

    //example: a|e,d,c,d|g,f|...
    stringVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            for (let j = 0; j < splitted2.length; j++)
                res2.push(parseInt(splitted2[j]))
            res.push(res2)
        }
        return res
    },

    //example: 1|2,3,5,6|7,8|...
    positiveNumberVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            for (let j = 0; j < splitted2.length; j++) {
                if (!this._isValidPositiveInt(splitted2[j]))
                    throw {
                        'stage': '[Parse]',
                        "msg": `${splitted2} must be a positive Int in: ${splitted2} but it's not!`
                    }
                res2.push(parseFloat(splitted2[j]))
            }
            res.push(res2)
        }
        return res
    },

    //example: -1|2,-3,5,6|7,-8|...
    numberVecs(arg) {
        let splitted = arg.split('|')
        let res = []

        for (let i = 0; i < splitted.length; i++) {
            let res2 = []

            if (splitted[i][0] === ',' || splitted[i][splitted[i].length - 1] === ',')
                throw {
                    'stage': '[Parse]',
                    "msg": `Trailing comma is invalid at arg ${splitted[i]} !`
                }

            let splitted2 = splitted[i].split(',')

            for (let j = 0; j < splitted2.length; j++) {
                if (!this._isValidInt(splitted2[j]))
                    throw {
                        'stage': '[Parse]',
                        "msg": `${splitted2} must be an Int in: ${splitted2} but it's not!`
                    }
                res2.push(parseFloat(splitted2[j]))
            }
            res.push(res2)
        }
        return res
    },

    /*Legacy*/
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
    },
    _isValidPositiveInt(arg) {

        if (!isNaN(arg) && !isNaN(parseInt(arg)))
            return parseInt(arg) >= 0
        return false
    }
}