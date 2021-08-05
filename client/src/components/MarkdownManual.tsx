import MarkdownRenderer from './markdown/MarkdownRenderer';
import React, { useState, useEffect } from 'react';

import { FormattedMessage } from 'react-intl';

interface PopupProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function MarkdownManual({visible, setVisible} : PopupProps) {
    const [manual, setManual] = useState('');
    useEffect(() =>{
        const fetchManual = async () => {
            const man = await (await fetch(process.env.PUBLIC_URL + '/editor-manual.md')).text();
            setManual(man);
        }
        fetchManual();
    }, [])

    if(!visible) return <></>;
    else return (
        <>
            <div className='manualShadow' onClick={() => setVisible(false) }></div>
            <div className='manualContainer previewArea'>
                <span className='material-icons backButton link' onClick={() => setVisible(false)}> arrow_back </span>
                <div className='manualHeader'>
                    <FormattedMessage id='editor.manual' />
                </div>
                <MarkdownRenderer isManual={ true }>
                    { manual }
                </MarkdownRenderer>
            </div>
        </>
    )
}

export default MarkdownManual;