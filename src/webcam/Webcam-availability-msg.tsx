interface Props {
    stream: null | undefined | MediaStream
}

function WebcamAvailabilityMsg({ stream }: Props) {
    let message = null

    if (stream === null)
        message = "No permission given to use device's camera."
    else if (stream === undefined)
        message = "No camera available."
    else message = ""

    return (
        <div id="webcam-status-message" className={ (message.length > 0) ? "container-color-warning" : "" }>
            <p>{ message }</p>
        </div>
    )
}

export default WebcamAvailabilityMsg