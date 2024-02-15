import { useEffect, useRef, useState } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { setupBodyDetector } from "../lib/detection/poseDetection"
// import * as handDetector from "@tensorflow-models/hand-pose-detection"
// import { setupHandDetector } from "../lib/handPoseDetection"
import Webcam from "../webcam/Webcam"
import { hookPoseVisualizerToVideo } from "../lib/detection/poseHook"
import ToggleWrapper from "../wrappers/Toggle-wrapper"
import "./poseTracking.css"

function PoseTracking() {
    const detectors = useRef<poseDetection.PoseDetector | null>(null)
    const webcamElement = useRef<HTMLVideoElement | null>(null)
    const [visualizerHook, setVisualizerHook] = useState<number | null>(null)
    const [reps, setReps] = useState<number>(0)

    useEffect(() => {
        if (!detectors.current) {
            setupBodyDetector()
                .then((poseDetector) => {
                    detectors.current = poseDetector
                })
        }

        if (webcamElement.current && detectors.current) {
            const hooks = hookPoseVisualizerToVideo(
                "webcam-result", webcamElement.current, detectors.current, () => setReps(reps + 1)
            )

            if (hooks)
                setVisualizerHook(hooks.interval)
        }

        return () => {
            if (visualizerHook)
                clearInterval(visualizerHook)
            detectors.current?.dispose
        }
    }, [reps])

    return (
        <div className="source-container">
            <ToggleWrapper>
                <span id="rep-status">Status: Failure | Passable | Good | Excelent</span>
            </ToggleWrapper>
            <ToggleWrapper>
                <span id="reps-index">Reps: { reps }</span>
            </ToggleWrapper>
            <div className="pose-tracking-container">
                <div className="pinned">
                    <Webcam width={ 500 } height={ 375 } webcamVideo={ webcamElement } />
                </div>
                <canvas id="webcam-result" className="focus" width={ 500 } height={ 375 }></canvas>
            </div>
        </div>
    )
}

export default PoseTracking
