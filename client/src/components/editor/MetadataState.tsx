import create, { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Metadata } from '#/../../common/Article';

export type { Metadata };

export interface MetadataState extends Metadata{
    setTitle: (title: string) => any,
    setAuthor: (author: string) => any,
    setVisibility: (visibility: number) => any
}

export const createMetadataState: StateCreator<
    any, [], [], MetadataState
> = (set, get, api) => ({
    title: '',
    author: '',
    tags: [],
    visibility: 2, // default to 2(public).

    setTitle(title){
        set((state: MetadataState)=>{ state.title = title; });
    },
    setAuthor(author){
        set((state: MetadataState)=>{ state.author = author; });
    },
    setVisibility(visibility) {
        set((state: MetadataState)=>{ state.visibility = visibility; });
    },
})

export const useMetadataState = create<MetadataState>()(
    immer(createMetadataState)
)

export const useMetadataInit = () => useMetadataState(
    state => (metadata: Partial<Metadata>) => {
        Object.assign(state, metadata);
    }
)