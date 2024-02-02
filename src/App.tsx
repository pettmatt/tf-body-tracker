import "./App.css"
import videoSource from "/Nike Commercial - .mp4"
import testPose from "/test-pose.jpg"
import { useEffect } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import trackPose from "./lib/poseDetection"
import { visualizePose } from "./lib/poseVisualizer"

function hookPoseVisualizerToVideo() {
    trackPose("video-source")
        .then((poses: poseDetection.Pose[]): void => {
            visualizePose(poses, "video-result")
        })
        .catch((rejected): void => {
            if (typeof rejected === "number")
                console.warn("Couldn't track a pose from video. Pose status:", rejected)
            else 
                console.warn("Possible error occured during video pose tracking.", rejected as Error)
        })
}

function App() {
    useEffect(() => {
        trackPose("image-source")
            .then((poses: poseDetection.Pose[]): void => {
                visualizePose(poses, "image-result")
            })
            .catch((rejected): void => {
                if (typeof rejected === "number")
                    console.warn("Couldn't track a pose from image. Pose status:", rejected)
                else
                    console.warn("Possible error occured during image pose tracking.", rejected as Error)
            })
    })

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
                <video id="video-source" width={ 355.55 } height={ 200 } typeof="video/mp4" autoPlay muted src={ videoSource }
                    onPlay={ hookPoseVisualizerToVideo }>
                    <p>Sorry, this browser doesn't support HTML videos.</p>
                </video>
                <canvas id="video-result" className="result" width={ 355.55 } height={ 200 }></canvas>
            </div>
        </>
    )
}

export default App
