import { useEffect, useRef, useState } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { setupDetector } from "../lib/poseDetection"
import Webcam from "../webcam/Webcam"
import { hookPoseVisualizerToVideo } from "../lib/poseHook"

function PoseTracking() {
    const detector = useRef<poseDetection.PoseDetector | null>(null)
    const webcamElement = useRef<HTMLVideoElement | null>(null)
    const [hook, setHook] = useState<number | null>(null)

    useEffect(() => {
        if (!detector.current) {
            setupDetector()
                .then((poseDetector) => {
                    detector.current = poseDetector
                })
        }

        if (!hook && detector.current && webcamElement.current) {
            const hook = hookPoseVisualizerToVideo("webcam-result", webcamElement.current, detector.current)
            setHook(hook)
        }
    }, [detector, hook])

    return (
        <div className="source-container">
            <h2>Web cam source</h2>
            <Webcam width={ 500 } height={ 375 } webcamVideo={ webcamElement } />
            <canvas id="webcam-result" width={ 500 } height={ 375 }></canvas>
        </div>
    )
}

export default PoseTracking
