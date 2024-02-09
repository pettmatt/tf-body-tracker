import * as poseDetection from "@tensorflow-models/pose-detection"

export function validKeypoints(poses: poseDetection.Pose[], targetKeypoints: string[]) {
    const { keypoints } = poses[0]
    const validKeypoints = []

    for (let i = 0; i < keypoints.length; i++) {
        const { name } = keypoints[i]

        for (let ii = 0; ii < targetKeypoints.length; ii++) {
            if (name?.includes(targetKeypoints[ii]))
                validKeypoints.push(keypoints[i])
        }
    }

    return validKeypoints || null
}

export function calculateAngle(keypoints: poseDetection.Keypoint[]) {
    const a = keypoints[0]
    const b = keypoints[1]
    const c = keypoints[2]

    const wristToElbowRad = Math.atan2(c.y - b.y, c.x - b.x)
    const shoulderToElbowRad = Math.atan2(a.y - b.y, a.x - b.x)
    const radians =  wristToElbowRad - shoulderToElbowRad
    const angle = Math.abs(radians * 180 / Math.PI)
    return angle
}

export function calculateReps(keypoints: poseDetection.Keypoint[], reachedToRepMiddle: boolean, start: number, middle: number) {
    const angle = calculateAngle(keypoints)

    if (!reachedToRepMiddle) {
        // Start of the move (example: extend arm)
        if (angle > middle)
            return {
                reachedMiddle: true,
                finishedRep: false
            }
    } else {
        // End of the move (back to starting pose)
        if (angle < start) {
            return {
                reachedMiddle: false,
                finishedRep: true
            }
        }
    }

    return null
}