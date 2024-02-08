import { useEffect, useState } from "react"

function FetchUserDeviceStream(): MediaStream | null | undefined {
    const [stream, setStream] = useState<MediaStream | null | undefined>(null)

    useEffect(() => {
        if (!stream) {
            fetchWebcamStream()
        } else {
            return () => {
                // Stream cleanup process
                stream.getTracks().forEach(track => {
                    track.stop()
                })
            }
        }
    }, [stream])

    function fetchWebcamStream() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream: MediaStream) => {
                setStream(stream)
            })
            .catch((error: DOMException) => {
                console.error("UserPermission;", error)
                setStream(undefined)
            })
    }

    return stream
}

export default FetchUserDeviceStream