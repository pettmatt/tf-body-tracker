import { useEffect, useState } from "react"

interface Props {
    trigger: boolean
}

function RepTracking({ trigger }: Props) {
    const [childTrigger, setChildTrigger] = useState<boolean>(trigger)
    const [reps, setReps] = useState<number>(0)

    useEffect(() => {
        if (trigger) {
            handleReps()
            setChildTrigger(!childTrigger)
        }

        function handleReps() {
            let count = reps
            setReps(count++)
        }
    }, [trigger, childTrigger, reps])

    return (
        <p>Reps: { reps }</p>
    )
}

export default RepTracking