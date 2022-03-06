import Footer from 'components/Footer';
import Header from 'components/Header';

import { postFlat, FlatUploadItem } from 'etc/api/flat';
import React, {useCallback, useEffect, useRef} from 'react';
import { Redirect, useLocation } from 'react-router';
import { Flat } from 'components/naflat/flat';
import { FlatEditorComponent } from 'components/naflat/component';


function FlatWrite() {
    let [redirectTo, setRedirectTo] = React.useState<string>();
    let [title, setTitle] = React.useState<string>();
    let [author, setAuthor] = React.useState<string>();

    let upload = (title: string, author: string, flat: Flat) => {
        postFlat(title, author, flat).then(({success, index}) => {
            if (success) {
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
                <FlatEditorComponent
                    title={title}
                    setTitle={setTitle}
                    author={author}
                    setAuthor={setAuthor}
                    cellId='c0'
                    upload={upload}/>
            </div>
            <Footer/>
        </>
    )
}


export default FlatWrite;