import { useRef, useState } from "react"
import { getExcerciseTags, setExcerciseTags } from "../../lib/storage/localStorage"

function ExcerciseCreation() {
    const [newTagMenu, setNewTagMenu] = useState(false)
    const [showSubForm, setShowSubForm] = useState(false)
    const newTag = useRef<HTMLInputElement>(null)
    const [tags, setTags] = useState<string[] | undefined>(getExcerciseTags())
    const form = useRef<HTMLFormElement>(null)
    const excerciseForm = useRef<HTMLFormElement>(null)

    function createExcercise() {

    }

    function createNewTag() {
        const nTag = newTag.current?.value

        if (nTag) {
            if (tags) {
                const newTags = JSON.stringify([...tags, nTag])
                setExcerciseTags(newTags)
                setTags([...tags, nTag])
            }
            
            else {
                setExcerciseTags(nTag)
                setTags([nTag])
            }
        }

        setNewTagMenu(false)
    }

    return (
        <form ref={ form } onSubmit={ createExcercise }>

            <label htmlFor="name">Name</label>
            <input name="name" placeholder="Personal core strength"></input>

            <label htmlFor="excercises">Excercises</label>
            { !showSubForm &&
                <button name="excercises" onClick={ () => setShowSubForm(true) }>
                    +
                </button>
            }
            { showSubForm &&
                <ExcerciseForm ref={ excerciseForm } onSubmitFn={ (e: Event) => {
                    e.preventDefault()
                    setShowSubForm(false)
                    console.log("sub form ref", excerciseForm)
                } } />
            }

            <label htmlFor="tag">Excercise type</label>
            <input name="tag" list="tags" placeholder="Core"></input>
            <datalist id="tags">
                { tags && tags.map((tag: string, i: number) => {
                    <option key={ i } value={ tag }>
                        { tag }
                    </option>
                }) }
            </datalist>

            <button onClick={ () => setNewTagMenu(!newTagMenu) }>
                +
            </button>

            { newTagMenu &&
                <label htmlFor="new-tag">
                    Add
                    <input ref={ newTag } name="new-tag" onChange={ () => createNewTag }></input>
                </label>
            }

            <button type="submit">Create</button>
        </form>
    )
}

type ExcerciseFormProps = {
    ref: React.RefObject<HTMLFormElement>
    onSubmitFn?: (() => void)
}

function ExcerciseForm(props: ExcerciseFormProps) {
    return (
        <form ref={ props.ref } onSubmit={ props.onSubmitFn }>
            <label>Name of the excercise</label>
            <input placeholder="pull up"></input>

            <label htmlFor="set">Sets</label>
            <input type="number" name="sets" />

            <label htmlFor="reps">Reps (optional)</label>
            <input type="number" name="reps" />

            <label htmlFor="rest">Rest time between sets (seconds)</label>
            <input type="number" min={0} max={ 60 * 15 } />

            <button type="submit">Add</button>
        </form>
    )
}

export default ExcerciseCreation