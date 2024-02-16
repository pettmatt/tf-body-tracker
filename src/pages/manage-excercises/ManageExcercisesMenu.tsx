import { useState } from "react"
import { Excercise } from "../../lib/types/excerciseTypes"
import { getExcercises } from "../../lib/storage/localStorage"
import ExcerciseCreation from "./ExcerciseCreation"

function ManageExcercisesMenu() {
    const [excercises, setExercises] = useState<Excercise[] | undefined>(getExcercises())
    const [showExcerciseMenu, setShowExcerciseMenu] = useState(false)

    useState(() => {
        console.log(excercises)
    })

    return (
        <div className="excercise-menu-container">
            <ul>
                { excercises?.map((e, i) => (
                    <li key={ i }>
                        { e.name }
                    </li>
                )) }

                { excercises === undefined && (
                    <p>You haven't created any excercises.</p>
                )}
            </ul>

            <button onClick={ () =>
                setShowExcerciseMenu(!showExcerciseMenu)
            }>
                Create new excercise
            </button>

            { showExcerciseMenu &&
                <ExcerciseCreation />
            }
        </div>
        
    )
}

export default ManageExcercisesMenu