import React, { useRef, useCallback } from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

// useful helper function
// https://medium.com/welldone-software/usecallback-might-be-what-you-meant-by-useref-useeffect-773bc0278ae
function useRefWithCallback<T>(
    onMount? : (node : T) => void, //constructor
    onUnmount? : (node : T) => void //destructor
) {
    const nodeRef = useRef<T | null>(null);
    const setRef = useCallback(node => {
        if(nodeRef.current && onUnmount){
            onUnmount(nodeRef.current);
        }
        nodeRef.current = node;
        if(nodeRef.current && onMount){
            onMount(nodeRef.current);
        }
    }, []);
    return setRef;
}

interface SingletonTextAreaProps extends TextareaAutosizeProps {
    initialSelectionStart? : number;
    initialSelectionEnd? : number;
}

function SingletonTextArea(props : SingletonTextAreaProps){
    let {
        initialSelectionStart,
        initialSelectionEnd,
        ...others
    } = props;

    function onMount(ta: HTMLTextAreaElement){
        if(initialSelectionStart){
            ta.selectionStart = initialSelectionStart;

            if(initialSelectionEnd){
                ta.selectionEnd = initialSelectionEnd;
            }
            else{
                ta.selectionEnd = initialSelectionStart;
            }
        }
    }

    const ref = useRefWithCallback<HTMLTextAreaElement>(
        onMount,
        undefined
    );

    return (
        <TextareaAutosize autoFocus
            {...others} //style, name, className, onChange, value, ...
            ref={ ref }
            spellCheck={false} autoComplete='off' autoCorrect='off' autoCapitalize='off'
        />
    );
}

export default SingletonTextArea;