import { visualizePose } from "./poseVisualizer"
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import { trackPose } from "./poseDetection"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { trackWorkout } from "./workout/workoutTracking"

interface ReturnObject {
    interval: number | null
}

export function hookPoseVisualizerToVideo(elementId: string,source: PixelInput, detector: poseDetection.PoseDetector, repHandleFn: () => void, frameRate: number = 20): ReturnObject | null {
    try {
        // This can be probably moved to session storage
        let reachedToRepMiddle = false
        let moveResult = false

        const interval = setInterval(async () => {
            trackPose(source, detector)
                .then((poses: poseDetection.Pose[]) => {
                    const workoutStatus = trackWorkout(poses, reachedToRepMiddle, moveResult, repHandleFn)
                    reachedToRepMiddle = workoutStatus.reachedToRepMiddle
                    moveResult = workoutStatus.moveResult

                    visualizePose(poses, elementId)
                })
                .catch((error: Error) => {
                    console.warn("PoseHook:Visualizer:Error;", error)
                })
            return () => clearInterval(interval)
        }, Math.round(1000 / frameRate))

        return { interval }
    } catch (error) {
        console.error("PoseHook:Visualizer:Error;", error)
        return null
    }
}