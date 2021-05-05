import MarkdownRenderer from './markdown/MarkdownRenderer';
import React, { useState, useEffect } from 'react';

interface PopupProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function MarkdownManual({visible, setVisible} : PopupProps) {
    const [manual, setManual] = useState('');
    useEffect(() =>{
        const fetchManual = async () => {
            const man = await (await fetch('/editor-manual.md')).text();
            setManual(man);
        }
        fetchManual();
    }, [])

    if(!visible) return <></>;
    else return (
        <>
            <div className='popupShadow' onClick={() => setVisible(false) }></div>
            <div className='popupContainer previewArea markdown'>
                <span className='material-icons backButton link' onClick={() => setVisible(false)}> arrow_back </span>
                <div className='popupHeader'> 편집기 문법 가이드 </div>
                <MarkdownRenderer>
                    { manual }
                </MarkdownRenderer>
            </div>
        </>
    )
}

export default MarkdownManual;