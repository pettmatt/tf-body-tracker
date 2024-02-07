import { useRef } from "react"
import WebcamAvailabilityMsg from "./Webcam-availability-msg"
import FetchUserDeviceStream from "./userPermission"

function play(videoRef: React.MutableRefObject<HTMLVideoElement | null>) {
    videoRef.current?.play()
}

interface Props {
    width: number
    height: number
}

function Webcam(props: Props) {
    const video = useRef<HTMLVideoElement | null>(null)
    const stream = FetchUserDeviceStream()

    if (stream && !video.current) {
        video.current = new HTMLVideoElement() 
        video.current.srcObject = stream
    }

    return (
        <video ref={ video } onCanPlay={ () => play(video) } width={ props.width } height={ props.height } autoPlay muted playsInline>
            <WebcamAvailabilityMsg stream={ stream } />
        </video>
    )
}

export default Webcam