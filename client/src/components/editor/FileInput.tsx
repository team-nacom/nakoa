import { useTranslation } from 'react-i18next';

import { FileDropzone } from '#/components/helpers/FileDropzone';
import { useFileMapDataAction, useFileMapState, generatePath } from './FileMapState';

export interface FileInputProps{
    imgUploadHandler?: (file: File, path: string) => any;
    fileUploadHandler?: (file: File, path: string) => any;
}

export function FileInput({
    imgUploadHandler,
    fileUploadHandler,
}: FileInputProps){
    const { i18n } = useTranslation();
    const { map } = useFileMapState();
    const { addFile } = useFileMapDataAction();

    return (
        <div className='dropzoneWrapper'>
            <FileDropzone
                handleDrop={ (files) => {
                    addFile(files[0], files[0].name, true, path => {
                        imgUploadHandler && imgUploadHandler(files[0], path);
                    });
                } }
            >
                <label>{ i18n.t('editor.attachImages') }</label>
            </FileDropzone>
            <FileDropzone
                handleDrop={ (files) => {
                    addFile(files[0], files[0].name, true, path => {
                        fileUploadHandler && fileUploadHandler(files[0], path);
                    });
                } }
            >
                <label>{ i18n.t('editor.attachFiles') }</label>
            </FileDropzone>
        </div>
    );
}