import { Excercise } from "../types/excerciseTypes"

function setLocalStorage(name: string, value: object | number | string | boolean): void {
    localStorage.setItem(name, JSON.stringify(value))
}

function getLocalStorage(name: string): object | undefined {
    const item = localStorage.getItem(name)
    return (item) ? JSON.parse(item) : undefined
}


export function getExcercises(): Excercise[] | undefined  {
    const excercises = getLocalStorage("personal-excercises")
    return excercises as Excercise[] | undefined
}

export function setExcercises(value: Excercise[]) {
    setLocalStorage("personal-excercises", JSON.stringify(value))
}

export function getExcerciseTags(): string[] | undefined {
    const tags = getLocalStorage("personal-excercises")
    return tags as string[] | undefined
}

export function setExcerciseTags(value: string) {
    setLocalStorage("excerciseTags", value)
}