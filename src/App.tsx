import "./App.css"
import { useEffect, useRef } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { trackPose, setupDetector } from "./lib/poseDetection"
import { visualizePose } from "./lib/poseVisualizer"
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import Webcam from "./webcam/Webcam"

function hookPoseVisualizerToVideo(source: PixelInput, detector: poseDetection.PoseDetector, frameRate: number = 20) {
    try {
        const interval = setInterval(async () => {
            trackPose(source, detector)
                .then((poses: poseDetection.Pose[]): void => {
                    visualizePose(poses, "video-result")
                })
                .catch((error: Error): void => {
                    console.warn("Possible error occured during the video pose tracking.", error)
                })
            return () => clearInterval(interval)
        }, Math.round(1000 / frameRate))
    } catch (error) {
        console.log("Video pose visualizer hook failed.", error)
    }
}

function App() {
    const detectorRef = useRef<poseDetection.PoseDetector | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!detectorRef.current) {
            setupDetector()
                .then((poseDetector) => {
                    detectorRef.current = poseDetector
                })
        }

        // if (detectorRef.current) {
        //     trackPose(webcamRef.current, detectorRef.current)
        //         .then((poses: poseDetection.Pose[]): void => {
        //             visualizePose(poses, "image-result")
        //         })
        //         .catch((rejected): void => {
        //             if (typeof rejected === "number")
        //                 console.warn("Couldn't track a pose from the image. Pose status:", rejected)
        //             else
        //                 console.warn("Possible error occured during the image pose tracking.", rejected as Error)
        //         })
        // }
    }, [detectorRef])

    return (
        <>
        <h1>Tracking poses</h1>
        <div className="source-container">
            <h2>Web cam source</h2>
            <Webcam width={ 500 } height={ 500 } />
        </div>
        </>
    )
}

export default App
