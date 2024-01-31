import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces"
import "./App.css"
import * as poseDetection from "@tensorflow-models/pose-detection"
// import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
// Register one of the TF.js backends.

// import videoSource from "../public/Nike Commercial - .mp4"
import testPose from "../public/test-pose.jpg"
import { useEffect } from "react"

async function trackPose(sourceElementId: string): Promise<poseDetection.Pose[]> {
    const config: poseDetection.MoveNetModelConfig = {
        enableSmoothing: true,
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    }

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, config)
    const element: PixelInput = document.getElementById(sourceElementId) as HTMLImageElement | HTMLVideoElement
    const poses = await detector.estimatePoses(element)

    if (poses.length !== 0)
        console.log(poses[0].keypoints)

    return new Promise((resolve, reject) =>
        (poses.length > 0)
            ? resolve(poses)
            : reject(0)
    )
}

function visualizePose(poses: poseDetection.Pose[]) {
    const { keypoints, score } = poses[0] // Expecting only one person.
    const canvas = document.querySelector("#result") as HTMLCanvasElement
    const context = canvas.getContext("2d")!

    if (score! < 0.3) return

    visualizeHotspots(keypoints, context)
    connectHotspots(keypoints, context)
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

function connectHotspots(keypoints: poseDetection.Keypoint[], context: CanvasRenderingContext2D) {
    // Connecting dots is easier when they are in the correct order, separating left and right sides as well as the head
    const remainingKeypoints = keypoints.slice(5, keypoints.length)
    // const head = keypoints.slice(0, 5)
    const leftSide = []
    const rightSide = []

    for (let i = 0; i < remainingKeypoints.length; i++) {
        if (i % 2 === 0) {
            leftSide.push(remainingKeypoints[i])
        } else {
            rightSide.push(remainingKeypoints[i])
        }
    }

    const fullBody = [leftSide, rightSide]

    console.log("here")
    
    for (let x = 0; x < fullBody.length; x++) {
        const array = fullBody[x]
        for (let i = 0; i < array.length; i++) {
            if (array[i + 1] === undefined) break // preventing out of bounds error
            
            const score01 = array[i]?.score
            const score02 = array[i + 1]?.score
            console.log("score1", score01)
            const color = pickColor((score01! < score02!) ? score01 : score02)
            const { x: startX, y: startY } = array[i]
            const { x: endX, y: endY } = array[i + 1]
            console.log("coordinates S", startX, startY)
            console.log("coordinates E", endX, endY)
            
            context.fillStyle = color
            context.lineWidth = 2
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(endX, endY)
            context.stroke()
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

function App() {
    useEffect(() => {
        trackPose("source")
            .then((poses: poseDetection.Pose[]): void => {
                visualizePose(poses)
            })
            .catch((rejected): void => {
                if (typeof rejected === "number")
                    console.warn("Couldn't track a pose. Pose status:", rejected)
                else 
                    console.warn("Possible error occured.", rejected as Error)
            })
    })

    return (
        <>
            <h1>ML enhanced fitness</h1>
            <div>
                <h2>Source</h2>
                <img id="source" src={ testPose } width={ 355.55 } height={ 200 }></img>
            </div>
            <div>
                <h2>Result</h2>
                <canvas id="result" width={ 355.55 } height={ 200 }></canvas>
            </div>
        </>
    )
}

export default App
