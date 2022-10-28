import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    handleDrop: (acceptedFiles: File[]) => void;
    accept?: string;
    children?: React.ReactNode;
};

function FileDropzone({ handleDrop, accept, children } : FileDropzoneProps) {
    const onDrop = React.useCallback(handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept});
  
    return (
        <>
            <div {...getRootProps()}>
                { children }
            </div>
            <input {...getInputProps()} />
        </>
    )
}

export { FileDropzone };