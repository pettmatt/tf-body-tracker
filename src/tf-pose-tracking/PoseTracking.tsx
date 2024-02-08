import { useEffect, useRef, useState } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import * as handDetector from "@tensorflow-models/hand-pose-detection"
import { setupBodyDetector } from "../lib/poseDetection"
import { setupHandDetector } from "../lib/handPoseDetection"
import Webcam from "../webcam/Webcam"
import { hookPoseVisualizerToVideo } from "../lib/poseHook"

interface detectors {
    body: poseDetection.PoseDetector | null
    hands: handDetector.HandDetector | null
}

function PoseTracking() {
    const detectors = useRef<detectors>()
    const webcamElement = useRef<HTMLVideoElement | null>(null)
    const [visualizerHook, setVisualizerHook] = useState<number | null>(null)

    useEffect(() => {
        if (!detectors.current) {
            setupBodyDetector()
                .then((poseDetector) => {
                    detectors.current!.body = poseDetector
                })

            setupHandDetector
                .then((handDetector) => {
                    detectors.current!.hands = handDetector
                })
        }

        if (!visualizerHook && detectors.current?.body && webcamElement.current) {
            const hook = hookPoseVisualizerToVideo("webcam-result", webcamElement.current, detectors.current.body)
            setVisualizerHook(hook)
        }
    }, [detectors, visualizerHook])

    return (
        <div className="source-container">
            <h2>Web cam source</h2>
            <Webcam width={ 500 } height={ 375 } webcamVideo={ webcamElement } />
            <canvas id="webcam-result" width={ 500 } height={ 375 }></canvas>
        </div>
    )
}

export default PoseTracking
