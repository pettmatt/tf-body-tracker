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

    // if (poses.length !== 0)
    //     console.log(poses[0].keypoints)

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
    const arm = array.unordered.splice(0, length / 2)
    const leg = array.unordered.splice(0, length / 2)
    array.arm = arm
    array.leg = leg

    return array
}

function connectHotspots(keypoints: poseDetection.Keypoint[], context: CanvasRenderingContext2D) {
    // Connecting dots is easier when they are in the correct order, separating left and right sides as well as the head
    const remainingKeypoints = keypoints.slice(5, keypoints.length)
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
            console.log("KEY", key, typeof key, array)

            for (let i = 0; i + 1 < array.length; i++) {
                // Maybe useful later
                // const score01 = array[i]?.score
                // const score02 = array[i + 1]?.score
                // const color = pickColor((score01! < score02!) ? score01 : score02)
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
