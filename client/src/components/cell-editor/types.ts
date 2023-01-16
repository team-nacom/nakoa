export interface StructData{
    [id: string]: string[]
}

// wood type.
export interface Wood{
    rootId: string,
    title: string,
    author: string,
    structData: StructData
}