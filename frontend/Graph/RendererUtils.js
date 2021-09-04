/* Utility functions for the rendering engine*/

export function getArrowPoints(lineEndPos, cpPos, elevation = 15) {
    //calc direction of arrow
    let dirToEnd = sub(lineEndPos, cpPos)

    //calc elevation point
    let angleDirToEnd = angleFromVec(dirToEnd)

    let ePos = [0, 0]
    ePos[0] = Math.cos(angleDirToEnd - Math.PI) * elevation + lineEndPos[0]
    ePos[1] = Math.sin(angleDirToEnd - Math.PI) * elevation + lineEndPos[1]

    //calc triangle base elev px away from line
    let dirToEnd01 = norm(dirToEnd)
    let forwardVec = [0, 0, 1]
    let backwardVec = [0, 0, -1]

    let dir3dToEndPos = [dirToEnd01[0], dirToEnd01[1], 0]
    let p2 = cross(dir3dToEndPos, forwardVec)
    p2 = scalarMult3d(p2, elevation)
    p2 = add2d(p2, ePos)

    let p3 = cross(dir3dToEndPos, backwardVec)
    p3 = scalarMult3d(p3, elevation)
    p3 = add2d(p3, ePos)

    return { 'p1': lineEndPos, p2, p3 }
}

export function getBezierPointsWithCpElevationAndRadius(srcPos, destPos, srcRadius, destRadius, elev) {

    //calc middle point
    let middlePos = middle(srcPos, destPos)

    //calc perp vector & cp
    let vecToDestPos = sub(destPos, srcPos)
    let vecToDestPos01 = norm(vecToDestPos)
    let forwardVec = [0, 0, 1]
    let dir3dToDestPos = [vecToDestPos01[0], vecToDestPos01[1], 0]
    let cpPos = cross(dir3dToDestPos, forwardVec)
    cpPos = scalarMult3d(cpPos, elev) // move cp 'elev' pixels up perpendicular to vecToDestPos line
    cpPos[0] += middlePos[0]
    cpPos[1] += middlePos[1]

    //calc dir from srcPos to cp & from destPos to cp
    let dirFromSrcToCp = sub(cpPos, srcPos)
    let dirFromDestToCp = sub(cpPos, destPos)

    //create edge points on node with this dir and radii
    let srcPosToCpAngle = angleFromVec(dirFromSrcToCp)
    let destPosToCpAngle = angleFromVec(dirFromDestToCp)
    let lineStart = [0, 0]
    let lineEnd = [0, 0]

    lineStart[0] = Math.cos(srcPosToCpAngle) * srcRadius + srcPos[0]
    lineStart[1] = Math.sin(srcPosToCpAngle) * srcRadius + srcPos[1]

    lineEnd[0] = Math.cos(destPosToCpAngle) * destRadius + destPos[0]
    lineEnd[1] = Math.sin(destPosToCpAngle) * destRadius + destPos[1]

    return { lineStart, cpPos, lineEnd }
}

export function getConnIndexingPointWithElev(srcPos, controlPos, destPos, indexElev) {

    let t = 0.5
    let x = controlPos[0] + (1 - t) * (1 - t) * (srcPos[0] - controlPos[0]) + t * t * (destPos[0] - controlPos[0])
    let y = controlPos[1] + (1 - t) * (1 - t) * (srcPos[1] - controlPos[1]) + t * t * (destPos[1] - controlPos[1])

    let midPoint = middle(srcPos, destPos)
    let vecToDestPos = sub(destPos, srcPos)
    let vecToDestPos01 = norm(vecToDestPos)
    let forwardVec = [0, 0, 1]
    let backwardVec = [0, 0, -1]

    let dir3dToDestPos = [vecToDestPos01[0], vecToDestPos01[1], 0]
    let cpPos = ''
    if (indexElev >= 0)
        cpPos = cross(dir3dToDestPos, forwardVec)
    else
        cpPos = cross(dir3dToDestPos, backwardVec)

    cpPos = scalarMult3d(cpPos, indexElev) // move cp 'elev' pixels up perpendicular to vecToDestPos line
    cpPos[0] += midPoint[0]
    cpPos[1] += midPoint[1]

    let dir = sub(cpPos, midPoint)
    dir = norm(dir)
    dir = scalarMult2d(dir, indexElev)
    let indexingPos = [x + dir[0], y + dir[1]]
    return indexingPos
}

export function debugText(ctx_, pos, text) {
    ctx_.font = '0.60em Courier New'
    ctx_.strokeStyle = "#00000011"
    ctx_.fillStyle = "#00000066"
    ctx_.textAlign = "center"
    ctx_.textBaseline = "middle"
    ctx_.lineWidth = 2 //hardcoded
    ctx_.fillText(text, pos[0], pos[1])
    ctx_.strokeText(text, pos[0], pos[1])
}

export function debugLine(ctx_, p1, p2) {
    ctx_.strokeStyle = '#00000011'
    ctx_.lineWidth = 1 //hardcoded
    ctx_.beginPath()
    ctx_.moveTo(p1[0], p1[1])
    ctx_.lineTo(p2[0], p2[1])
    ctx_.stroke()
}

export function debugNode(ctx_, vec, rad = 5) {
    //node itself
    ctx_.beginPath()
    ctx_.arc(vec[0], vec[1], rad, 0, 2 * Math.PI)
    ctx_.lineWidth = 4 //hardcoded
    ctx_.strokeStyle = 'black'
    ctx_.stroke()
}

export function add2d(vec, vec2) {
    return [vec[0] + vec2[0], vec[1] + vec2[1]]
}

export function angleFromVec(vec) {
    //returns rads
    return Math.atan2(vec[1], vec[0])
}

export function scalarMult2d(vec, scale) {
    return [vec[0] * scale, vec[1] * scale]
}

export function scalarMult3d(vec, scale) {
    return [vec[0] * scale, vec[1] * scale, vec[2] * scale]
}

export function cross(vec, vec2) {
    return [vec[1] * vec2[2] - vec[2] * vec2[1], vec[2] * vec2[0] - vec[0] * vec2[2], vec[0] * vec2[1] - vec[1] * vec2[0]]
}

export function middle(vec, vec2) {
    return [(vec[0] + vec2[0]) / 2, (vec[1] + vec2[1]) / 2]
}

export function mag(vec) {
    return Math.sqrt(vec[0] ** 2 + vec[1] ** 2)
}

export function norm(vec) {
    return [vec[0] / mag(vec), vec[1] / mag(vec)]
}

export function sub(vec, vec2) {
    return [vec[0] - vec2[0], vec[1] - vec2[1]]
}

export function getNodeData(po, opt) {

    const nodeDefaults = {
        '-color': 'black',
        '-radius': 30
    }
    if (po[opt] || po[opt] === 0)
        return po[opt]
    return nodeDefaults[opt]
}

export function getConnData(po, opt) {

    const connDefaults = {
        '-color': 'black',
        '-directed': false, //conns are undir by default
        '-elev': 100
    }

    if (po[opt] || po[opt] === 0)
        return po[opt]
    return connDefaults[opt]
}
