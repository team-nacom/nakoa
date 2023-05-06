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
    addFile: async (file: File, attachmentIndex?: string, renameOnDuplicate?: boolean, callback?: (attachmentIndex: string) => any) => produce((state: FileMapData) => {
        attachmentIndex ??= generatePath(state.map);
        attachmentIndex = attachmentIndex.split(' ').join('_'); // should not have space

        if(renameOnDuplicate && state.map[attachmentIndex] !== undefined){ // handle duplicate.
            for(let i = 1; ; ++i){
                let arr = attachmentIndex.split('.');
                arr[0] += `(${i})`;
                let newIndex = arr.join('.');

                if(state.map[newIndex] === undefined){
                    attachmentIndex = newIndex;
                    break;
                }
            }
        }
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