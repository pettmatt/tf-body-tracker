import { useEffect, Dispatch, SetStateAction } from "react"

type Props = {
    hook: [number, Dispatch<SetStateAction<number>>]
}

function RepTracking({ hook }: Props) {
    const [reps, setReps] = hook

    useEffect(() => {
        setReps(reps + 1)
    }, [reps, setReps])

    return (
        <p>Reps: { reps }</p>
    )
}

export default RepTracking