import { visualizePose } from "../poseVisualizer"
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import { trackPose } from "./poseDetection"
import * as poseDetection from "@tensorflow-models/pose-detection"

export function hookPoseVisualizerToVideo(elementId: string,source: PixelInput, detector: poseDetection.PoseDetector, frameRate: number = 20): number | null {
    try {
        const interval = setInterval(async () => {
            trackPose(source, detector)
                .then((poses: poseDetection.Pose[]): void => {
                    visualizePose(poses, elementId)
                })
                .catch((error: Error): void => {
                    console.warn("Possible error occured during the video pose tracking.", error)
                })
            // return () => clearInterval(interval)
        }, Math.round(1000 / frameRate))

        return interval
    } catch (error) {
        console.log("Video pose visualizer hook failed.", error)
        return null
    }
}