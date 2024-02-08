import { MutableRefObject } from "react"
import WebcamAvailabilityMsg from "./Webcam-availability-msg"
import FetchUserDeviceStream from "./userPermission"

function play(videoRef: MutableRefObject<HTMLVideoElement | null | undefined>) {
    videoRef.current?.play()
}

interface Props {
    width: number
    height: number
    webcamVideo: MutableRefObject<HTMLVideoElement | null>
}



function Webcam(props: Props) {
    const stream = FetchUserDeviceStream()
    const video = props.webcamVideo
    
    if (stream)
        video.current!.srcObject = stream

    return (
        <video ref={ video } onCanPlay={ () => play(video) } width={ props.width } height={ props.height } autoPlay muted playsInline>
            <WebcamAvailabilityMsg stream={ stream } />
        </video>
    )
}

export default Webcam