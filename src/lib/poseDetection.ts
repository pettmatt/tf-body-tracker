import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import * as poseDetection from "@tensorflow-models/pose-detection"
import "@tensorflow/tfjs-backend-webgl"

async function trackPose(sourceElementId: string): Promise<poseDetection.Pose[]> {
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, { runtime: "tfjs", modelType: "lite" })
    const element: PixelInput = document.getElementById(sourceElementId) as HTMLImageElement | HTMLVideoElement
    const poses = await detector.estimatePoses(element)

    // if (poses.length !== 0)
    //     console.log(poses[0].keypoints)

    return new Promise((resolve, reject) =>
        (poses.length > 0)
            ? resolve(poses)
            : reject(0)
    )
}

export default trackPose