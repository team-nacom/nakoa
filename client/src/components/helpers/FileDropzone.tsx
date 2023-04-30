import { useCallback, PropsWithChildren } from 'react';
import { useDropzone } from 'react-dropzone';

export interface FileDropzoneProps {
    handleDrop: (acceptedFiles: File[]) => void;
    accept?: string;
    noClick?: boolean;
};

export function FileDropzone({ handleDrop, accept, noClick, children } : PropsWithChildren<FileDropzoneProps>) {
    // const onDrop = useCallback(handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop: handleDrop, accept, noClick });
  
    return (
        <div {...getRootProps()}
            className={ `dropzone ${ isDragActive? `dragging` : `` }` }
        >
            { children }
            <input {...getInputProps()} />
        </div>
    )
}