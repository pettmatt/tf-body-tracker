import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import "@tensorflow/tfjs-backend-webgl"
import * as poseDetection from "@tensorflow-models/pose-detection"

export async function trackPose(input: PixelInput, detector: poseDetection.PoseDetector): Promise<poseDetection.Pose[]> {
    const config: poseDetection.BlazePoseTfjsEstimationConfig = {
        maxPoses: 1
    }

    const poses = await detector.estimatePoses(input, config)

    return new Promise((resolve) =>
        resolve(poses)
    )
}

export async function setupDetector() {
    const model = poseDetection.SupportedModels.BlazePose
    const config = { runtime: "tfjs", modelType: "full" }
    const detector = await poseDetection.createDetector(model, config)
    return detector
}