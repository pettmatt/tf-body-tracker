import "./App.css"
import videoSource from "/Nike Commercial - .mp4"
import testPose from "/test-pose.jpg"
import { useEffect, useRef } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { trackPose, setupDetector } from "./lib/poseDetection"
import { visualizePose } from "./lib/poseVisualizer"

function hookPoseVisualizerToVideo(detector: poseDetection.PoseDetector, frameRate: number = 20) {
    try {
        const interval = setInterval(async () => {
            trackPose("video-source", detector)
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

    useEffect(() => {
        setupDetector()
            .then((poseDetector) => {
                detectorRef.current = poseDetector
            })

        if (detectorRef.current) {
            trackPose("image-source", detectorRef.current)
                .then((poses: poseDetection.Pose[]): void => {
                    visualizePose(poses, "image-result")
                })
                .catch((rejected): void => {
                    if (typeof rejected === "number")
                        console.warn("Couldn't track a pose from the image. Pose status:", rejected)
                    else
                        console.warn("Possible error occured during the image pose tracking.", rejected as Error)
                })
        }
    }, [detectorRef])

    return (
        <>
            <h1>Tracking poses</h1>
            <h2>Image source</h2>
            <div className="source-container">
                <img id="image-source" src={ testPose } width={ 355.55 } height={ 200 }></img>
                <canvas id="image-result" className="result" width={ 355.55 } height={ 200 }></canvas>
            </div>
            <h2>Video source</h2>
            <div className="source-container">
                <video id="video-source" width={ 355.55 } height={ 200 } typeof="video/mp4" autoPlay muted 
                    src={ videoSource } onPlaying={ () => {
                        let triedCount = 0

                        const interval = setInterval(() => {
                            if (detectorRef.current)
                                hookPoseVisualizerToVideo(detectorRef.current)

                            if (triedCount > 3)
                                clearInterval(interval)

                            triedCount++
                        }, 1000)
                    } }
                >
                    <p>Sorry, this browser doesn't support HTML videos.</p>
                </video>
                <canvas id="video-result" className="result" width={ 355.55 } height={ 200 }></canvas>
            </div>
        </>
    )
}

export default App
