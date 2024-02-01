import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import "./App.css"
import * as poseDetection from "@tensorflow-models/pose-detection"
// import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
// Register one of the TF.js backends.

import videoSource from "/Nike Commercial - .mp4"
import testPose from "/test-pose.jpg"
import { useEffect } from "react"

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

function visualizePose(poses: poseDetection.Pose[], resultId: string) {
    const { keypoints, score } = poses[0] // Expecting only one person.
    const canvas = document.getElementById(resultId) as HTMLCanvasElement
    const context = canvas.getContext("2d")!

    if (score! < 0.3) return

    connectHotspots(keypoints, context)
    visualizeHotspots(keypoints, context)
}

function visualizeHotspots(keypoints: poseDetection.Keypoint[], context: CanvasRenderingContext2D) {
    for (let i = 0; i < keypoints.length; i++) {
        const score = keypoints[i]?.score
        const color = pickColor(score)
        const { x, y } = keypoints[i]

        context.fillStyle = color
        context.beginPath()
        context.arc(x, y, 3, 0, 2 * Math.PI)
        context.fill()
        context.stroke()
    }
}

type Bodyparts = {
    arm: poseDetection.Keypoint[]
    leg: poseDetection.Keypoint[]
    unordered: poseDetection.Keypoint[]
}

function categorializeJoints(array: Bodyparts): Bodyparts {
    const length = array.unordered.length
    // Switched to BlazePose, where arms and legs have different amount of "joint points"
    const arm = array.unordered.splice(0, (length / 2) + 1)
    const leg = array.unordered.splice(0, (length / 2) - 1)
    array.arm = arm
    array.leg = leg

    return array
}

function connectHotspots(keypoints: poseDetection.Keypoint[], context: CanvasRenderingContext2D) {
    // Connecting dots is easier when they are in the correct order, separating left and right sides as well as the head
    const remainingKeypoints = keypoints.slice(11, keypoints.length)
    // const head = keypoints.slice(0, 5)
    let leftSide: Bodyparts = { arm: [], leg: [], unordered: [] }
    let rightSide: Bodyparts = { arm: [], leg: [], unordered: [] }

    // Separate the sides, makes it easier to connect joints later
    for (let i = 0; i < remainingKeypoints.length; i++) {
        if (i % 2 === 0) {
            leftSide.unordered.push(remainingKeypoints[i])
        } else {
            rightSide.unordered.push(remainingKeypoints[i])
        }
    }

    leftSide = { ...categorializeJoints(leftSide) }
    rightSide = { ...categorializeJoints(rightSide) }

    const fullBody = [leftSide, rightSide]
    
    for (let x = 0; x < fullBody.length; x++) {
        const sideArray: Bodyparts = fullBody[x]

        for (const key in sideArray) {
            const array = sideArray[key]

            // i + 1 prevents out of bounds error
            for (let i = 0; i + 1 < array.length; i++) {
                // Maybe useful later, if I want to color the line based on the score
                // const score01 = array[i].score
                // const score02 = array[i + 1].score
                // const color = pickColor((score01 < score02) ? score01 : score02)
                const { x: startX, y: startY } = array[i]
                const { x: endX, y: endY } = array[i + 1]

                // context.fillStyle = color
                context.lineWidth = 2
                context.beginPath()
                context.moveTo(startX, startY)
                context.lineTo(endX, endY)
                context.stroke()
            }
        }
    }
}

function pickColor(score: number | undefined): string {
    if (!score) return ""
    if (score >= 0.7) return "green"
    else if (score >= 0.5) return "yellow"
    else if (score >= 0.3) return "red"
    else return "black"
}

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
