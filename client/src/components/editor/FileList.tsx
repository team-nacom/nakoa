import { useTranslation } from 'react-i18next';

import { useFileMapDataAction, useFileMapState, generatePath } from './FileMapState';
import Button from '../Button';

export function AttachmentList(){ // name 'FileList' is already taken.
    const { i18n } = useTranslation();
    const { map } = useFileMapState();
    const { addFile, removeFile } = useFileMapDataAction();

    return (
        <div className='attachmentsList'>
        { Object.entries(map).map(([path, file])=>(
            <p key={path}>
                filename: {path} {/* path should be filename-like */} 
                <Button onClick={ ()=>{
                    removeFile(path);
                } }>REMOVE</Button>
            </p>
        )) }
        </div>
    );
}