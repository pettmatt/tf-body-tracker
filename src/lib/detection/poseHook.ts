import { visualizePose } from "./poseVisualizer"
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import { trackPose } from "./poseDetection"
import { calculateReps, validKeypoints } from "./poseCalculation"
import * as poseDetection from "@tensorflow-models/pose-detection"

interface ReturnObject {
    interval: number | null
    moveFinished: boolean
}

export function hookPoseVisualizerToVideo(elementId: string,source: PixelInput, detector: poseDetection.PoseDetector, handleReps: () => void, frameRate: number = 20): ReturnObject | null {
    try {
        let reachedToRepMiddle = false
        let moveResult = false

        const interval = setInterval(async () => {
            trackPose(source, detector)
                .then((poses: poseDetection.Pose[]) => {
                    // Calculating if user finishes the move, example used is curls.
                    const targetKeypoints = ["right_wrist", "right_elbow", "right_shoulder"]
                    const keypoints = validKeypoints(poses, targetKeypoints)
                    const result = calculateReps(keypoints, reachedToRepMiddle, 20, 130)
                    console.log("result", result)

                    if (result) {
                        reachedToRepMiddle = result.reachedMiddle
                        moveResult = result.finishedRep

                        if (moveResult) {
                            handleReps()
                            moveResult = false
                        }
                    }

                    visualizePose(poses, elementId)
                })
                .catch((error: Error) => {
                    console.warn("PoseHook:Visualizer;", error)
                })
            // return () => clearInterval(interval)
        }, Math.round(1000 / frameRate))

        return { interval, moveFinished: moveResult }
    } catch (error) {
        console.error("PoseHook:Visualizer:Error;", error)
        return null
    }
}