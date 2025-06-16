export type Excercise = {
    name: string
    type: string
    moves: Move[]
    previousRecords: Record[]
    completionCounter: number
}

type Move = {
    name: string
    type: string
    sets: string
    repsInSet?: number | undefined
    breakBetweenSets?: number | undefined
    personalBestReps?: number | undefined
}

type Record = Move & {
    setCount: number
    averageRepCount: number
}
