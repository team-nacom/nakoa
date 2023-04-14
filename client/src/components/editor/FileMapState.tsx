import create, { createStore, StateCreator } from 'zustand';
import { produce } from 'immer';

import { CtxFactoryCurry } from '#/misc/CtxFactory';
import { base64rand } from '#/misc/base64rand';

// import { deleteFile, setFile } from '#/api/file-local';

export interface FileMapData {
    map: { [path: string]: File; },
}

function createAttachmentDataStore(initMap: Partial<FileMapData>){
    return createStore<FileMapData>()((set, get, api) => ({
        ...({map: {}}),
        ...initMap,
    }));
}

export const [ FileMapDataProvider, useFileMapDataContext, useFileMapDataAction ] = CtxFactoryCurry<FileMapData>(createAttachmentDataStore)({
    // add file to idb and file map
    addFile: async (file: File, attachmentIndex?: string, callback?: (attachmentIndex: string) => any) => produce((state: FileMapData) => {
        attachmentIndex ??= generatePath(state.map);
        state.map[attachmentIndex] = file;

        // side effect.
        callback && callback(attachmentIndex);
    }),
    // remove file from idb and file map
    removeFile: async (attachmentIndex: string) => produce((state: FileMapData) => {
        delete state.map[attachmentIndex];
    }),
});

export const useFileMapState = () => useFileMapDataContext(
    state => state
);

export function generatePath(map: { [path: string]: File; }){
    let path = '';
    do{
        path = base64rand(8);
    } while( Object.keys(map).indexOf(path) !== -1 );
    return path;
}

export function unzipMap(map: { [path: string]: File; }){
    return Object.entries(map).reduce((prev, [path, file])=>{
        return {
            files: [...prev.files, file],
            filePaths: [...prev.filePaths, path]
        };
    }, { files: [] as File[], filePaths: [] as string[] });
}