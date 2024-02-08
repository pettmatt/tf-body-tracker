import * as handPoseDetection from "@tensorflow-models/hand-pose-detection"
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import "@tensorflow/tfjs-backend-webgl"

export async function setupHandDetector() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands
    const config: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
        runtime: "tfjs", modelType: "full"
    }
    const detector = await handPoseDetection.createDetector(model, config)
    return detector
}

export async function trackHandPose(input: PixelInput, detector: handPoseDetection.HandDetector): Promise<handPoseDetection.HandDetector.hand[]> {
    const config: handPoseDetection.EstimationConfig = {
        flipHorizontal: false,
        staticImageMode: true
    }

    const hands = await detector.estimateHands(input, config)

    return new Promise((resolve) =>
        resolve(hands)
    )
}