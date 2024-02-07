interface Props {
    stream: null | undefined | MediaStream
}

function WebcamAvailabilityMsg({ stream }: Props) {
    let message = null

    if (stream === null)
        message = "No permission given to use web cam."
    else if (stream === undefined)
        message = "No webcam available."
    else message = "The browser doesn't support HTML video element."

    return <p>{ message }</p>
}

export default WebcamAvailabilityMsg