import Footer from 'components/Footer';
import Header from 'components/Header';

import { postCell, CellUploadType } from 'etc/api/cell';
import React, {useCallback, useEffect, useRef} from 'react';
import { Redirect, useLocation } from 'react-router';
import DemoBubbleEditor from 'components/DemoBubbleEditor';
import { Flat } from 'components/naflat/flat';
import { FlatEditorComponent } from 'components/naflat/component';


function CellWrite() {
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let upload = (flat: Flat) => {
        postCell(flat).then(({success, index}) => {
            if (success) {
                setRedirectTo(`/cell/view/${index}`);
            }
            else alert('업로드에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <div id='content'>
                <FlatEditorComponent cellId='c0'/>
            </div>
            <Footer/>
        </>
    )
}


export default CellWrite;