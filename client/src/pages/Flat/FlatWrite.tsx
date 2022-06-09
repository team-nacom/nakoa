import Footer from 'components/Footer';
import Header from 'components/Header';

import { postFlat, FlatUploadItem, FlatItem } from 'etc/api/flat';
import React, {useCallback, useEffect, useRef} from 'react';
import { Redirect, useLocation } from 'react-router';
import { Flat } from 'components/naflat/flat';
import { FlatItemMetadata, FlatEditor } from 'components/editor/FlatEditor';
import { localStorageKeys } from 'etc/consts';

interface State {
    copySourceFlat?: FlatItem
}

function FlatWrite() {
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let location = useLocation<State>();
    let clonedFlat = location.state?.copySourceFlat;
    
    let storedFlatDraftString = localStorage.getItem(localStorageKeys.flatDraft);
    let storedFlatDraft = storedFlatDraftString ? JSON.parse(storedFlatDraftString) : null;
    let storedMetadataDraftString = localStorage.getItem(localStorageKeys.metadataDraft);
    let storedMetadataDraft = storedMetadataDraftString ? JSON.parse(storedMetadataDraftString) : null;

    let initialMetadata = { title: '', author: '' };
    let initialFlat = undefined;
    if (clonedFlat && clonedFlat.content) {
        initialMetadata = { title: clonedFlat.title, author: clonedFlat.author };
        initialFlat = JSON.parse(clonedFlat.content);
    }
    else {
        initialMetadata = storedMetadataDraft ?? initialMetadata;
        initialFlat = storedFlatDraft ?? initialFlat;
    }

    let upload = (metadata: FlatItemMetadata, flat: Flat) => {
        postFlat(metadata, flat).then(({success, index}) => {
            if (success) {
                localStorage.removeItem(localStorageKeys.flatDraft);
                localStorage.removeItem(localStorageKeys.metadataDraft);
                setRedirectTo(`/view/${index}`);
            }
            else alert('업로드에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <div id='content'>
                <FlatEditor
                    upload={upload}
                    metadata={initialMetadata}
                    initialFlat={initialFlat}
                />
            </div>
            <Footer/>
        </>
    )
}


export default FlatWrite;