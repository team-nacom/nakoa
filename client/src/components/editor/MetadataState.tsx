import create, { createStore, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Metadata } from '#common/Article';
import { CtxFactory } from '#/misc/CtxFactory';

export type { Metadata };

export interface MetadataState extends Metadata{
    setTitle: (title: string) => any,
    setAuthor: (author: string) => any,
    setVisibility: (visibility: number) => any
}

function createMetadataStore(initProps: Partial<Metadata>){
    const defaultProps : Metadata = {
        title: '',
        author: '',
        tags: [],
        visibility: 2
    };

    return createStore<MetadataState>()(immer((set, get, api) => ({
        ...initProps,
        ...defaultProps,

        setTitle(title){
            set((state: MetadataState)=>{ state.title = title; });
        },
        setAuthor(author){
            set((state: MetadataState)=>{ state.author = author; });
        },
        setVisibility(visibility) {
            set((state: MetadataState)=>{ state.visibility = visibility; });
        },
    })))
}

export const [ MetadataProvider, useMetadataContext ] = CtxFactory<MetadataState, Partial<Metadata>>(createMetadataStore);

export const useMetadataState = () => useMetadataContext(
    state => state
);