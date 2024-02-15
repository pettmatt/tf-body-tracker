import { calculateReps, validKeypoints } from "../poseCalculation"
import * as poseDetection from "@tensorflow-models/pose-detection"

export function trackWorkout(
    poses: poseDetection.Pose[],
    reachedToRepMiddle: boolean,
    moveResult: boolean,
    repHandleFn: () => void,
    targetKeypoints: string[] = ["right_wrist", "right_elbow", "right_shoulder"]
) {
    // Calculating if user finishes the move, example used is curls.
    const keypoints = validKeypoints(poses, targetKeypoints)
    const result = calculateReps(keypoints, reachedToRepMiddle, 20, 130)

    if (result) {
        reachedToRepMiddle = result.reachedMiddle
        moveResult = result.finishedRep

        if (moveResult) {
            repHandleFn()
            moveResult = false
        }
    }

    return { reachedToRepMiddle, moveResult }
}