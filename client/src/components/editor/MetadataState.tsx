import create, { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface Metadata{
    title: string,
    author: string
}

export interface MetadataState extends Metadata{
    setTitle: (title: string) => any,
    setAuthor: (author: string) => any
}

export const createMetadataState: StateCreator<
    any, [], [], MetadataState
> = (set, get, api) => ({
    title: '',
    author: '',

    setTitle(title){
        set((state: MetadataState)=>{ state.title = title })
    },
    setAuthor(author){
        set((state: MetadataState)=>{ state.author = author })
    },
})

export const useMetadataState = create<MetadataState>()(
    immer(createMetadataState)
)

export const useMetadataInit = () => useMetadataState(
    state => (metadata: Partial<Metadata>) => {
        state = {
            ...state,
            ...metadata
        }
    }
)