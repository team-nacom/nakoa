import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    handleDrop: (acceptedFiles: File[]) => void;
    children?: React.ReactNode;
};

function FileDropzone({ handleDrop, children } : FileDropzoneProps) {
    const onDrop = React.useCallback(handleDrop, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  
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