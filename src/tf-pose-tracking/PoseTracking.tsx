import { useEffect, useRef, useState } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
// import * as handDetector from "@tensorflow-models/hand-pose-detection"
import { setupBodyDetector } from "../lib/poseDetection"
// import { setupHandDetector } from "../lib/handPoseDetection"
import Webcam from "../webcam/Webcam"
import { hookPoseVisualizerToVideo } from "../lib/poseHook"

// interface detectors {
//     body: poseDetection.PoseDetector | null
//     hands: handDetector.HandDetector | null
// }

function PoseTracking() {
    const detectors = useRef<poseDetection.PoseDetector | null>(null)
    const webcamElement = useRef<HTMLVideoElement | null>(null)
    const [visualizerHook, setVisualizerHook] = useState<number | null>(null)

    useEffect(() => {
        if (!detectors.current) {
            setupBodyDetector()
                .then((poseDetector) => {
                    detectors.current = poseDetector
                })
        }

        if (!visualizerHook && detectors.current && webcamElement.current) {
            const hook = hookPoseVisualizerToVideo("webcam-result", webcamElement.current, detectors.current)
            setVisualizerHook(hook)
        }
    }, [detectors, visualizerHook])

    return (
        <div className="source-container">
            <Webcam width={ 500 } height={ 375 } webcamVideo={ webcamElement } />
            <canvas id="webcam-result" width={ 500 } height={ 375 }></canvas>
        </div>
    )
}

export default PoseTracking
