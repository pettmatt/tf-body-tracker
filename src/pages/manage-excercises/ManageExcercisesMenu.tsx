import { useState } from "react"

type excercise = {
    name: string
    type: string
    moves: object[]
    completionCounter: number
}

function ManageExcercisesMenu() {
    const [excercises, setExercises] = useState<excercise[]>([])

    useState(() => {

    })

    return (
        <div className="excercise-menu-container">
            <ul>
                { excercises.map((e, i) => (
                    <li key={ i }>
                        { e.name }
                    </li>
                )) }
            </ul>
        </div>
    )
}

export default ManageExcercisesMenu