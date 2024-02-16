import ManageExcercisesMenu from "./pages/manage-excercises/ManageExcercisesMenu"
import PoseTracking from "./pages/tf-pose-tracking/PoseTracking"
import { useState, createContext, useContext } from "react"
import "./App.css"

const MenuContext = createContext(0)

function App() {
    const [menu, setMenu] = useState(0)

    return (
        <MenuContext.Provider value={ menu }>
            <Back set={ setMenu } />

            { (menu === 0) && (
                <>
                <button onClick={ () => setMenu(1) }>Pose tracking</button>
                <button onClick={ () => setMenu(2) }>Manage excercises</button>
                </>
            ) }

            { (menu === 1) && (
                <PoseTracking />
            ) }

            { (menu === 2) && (
                <ManageExcercisesMenu />
            ) }
        </MenuContext.Provider>
    )
}

type BackProps = {
    set: React.Dispatch<React.SetStateAction<number>>
}

function Back({ set }: BackProps) {
    const context = useContext(MenuContext)

    return (
        <>
        { (context !== 0) &&
            <button onClick={ () => set(0) }>Back</button>
        }
        </>
    )
}

export default App