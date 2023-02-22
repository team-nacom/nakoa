import create, { createStore, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware/persist'

import { Metadata } from '#common/Article';
import { CtxFactoryCurry } from '#/misc/CtxFactory';

export type { Metadata };

function createMetadataStore(initProps: Partial<Metadata>){
    const defaultProps : Metadata = {
        title: '',
        author: '',
        tags: [],
        visibility: 2
    };

    return createStore<Metadata>()(immer((set, get, api) => ({
        ...defaultProps,
        ...initProps,
    })));
}

export const [ MetadataProvider, useMetadataContext, useMetadataAction ] = CtxFactoryCurry<Metadata>(createMetadataStore)({
    // setTitle: (title: string) => produce((state: Metadata) => { state.title = title }),
    setTitle: (title: string) => ({ title }),
    setAuthor: (author: string) => ({ author }),
    setVisibility: (visibility: number) => ({visibility}),
})

export const useMetadataState = () => useMetadataContext(
    state => state
);