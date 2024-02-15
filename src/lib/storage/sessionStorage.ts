function setSessionStorage(name: string, value: object | number | string | boolean): void {
    sessionStorage.setItem(name, JSON.stringify(value))
}

function getSessionStorage(name: string): string | null {
    const item = sessionStorage.getItem(name)
    return item
}

export function getRepsStorage(): number | null {
    const item = getSessionStorage("excercise-reps")
    return (item) ? JSON.parse(item) : null
}

export function updateRepsStorage(value: object | number | string): void {
    setSessionStorage("excercise-reps", JSON.stringify(value))
}

export function toggleFinishedRep() {
    const value = getSessionStorage("finishedRep")

    if (value === null) {
        setSessionStorage("finishedRep", true)
        return
    }

    setSessionStorage("finishedRep", !value)
}

export function toggleRepMiddle() {

}