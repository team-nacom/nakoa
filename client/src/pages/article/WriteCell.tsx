import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import { useMetadataState, Metadata } from '#/components/editor/MetadataState';

import { Layout, LayoutWithArticleList } from '#/layout/Layout';
import { Article, CellArticle, getArticle, postArticle, getAutosaveArticle, setAutosaveArticle } from '#/api/article';
import { CellEditor } from '#/components/editor/CellEditor';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function WriteCell() {
    const [loading, initArticle] = usePromise(() => getAutosaveArticle(undefined, 'cell'), []);

    // const [loading, initArticle] = usePromise(async () => {
    //     const draft = await getAutosaveArticle(undefined, 'cell');
    //     return draft;
    //     // if(draft !== undefined) return draft;
    //     // return undefined; // this will simplify setting default fields

    //     // return {
    //     //     mode: 'cell',
    //     //     metadata: {
    //     //         title: '',
    //     //         author: '',
    //     //     },
    //     //     content: {
    //     //         rootId: 'c0',
    //     //         structData: { 'c0': [] },
    //     //         cellData: { 'c0': { id: 'c0', [cellTypeStr]: 'root', mathMacroStr: '', } }
    //     //     }
    //     // };
    // }, []);

    // const [modified, setModified] = useState(false);

    // redirection state
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const upload = useCallback((metadata: Metadata, content: CellArticle['content']) => {
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

        const article: CellArticle = {
            mode: 'cell',
            metadata,
            content
        }
        postArticle(article).then(({success, index})=>{
            if(success){
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/article/view/${index}`);
            } else{
                setMessage('업로드에 실패했습니다.');
            }
        })
    }, []);

    // const autosave = useCallback((article: CellArticle) => {
    //     setAutosaveArticle(article);
    // }, []);
    // const autosave = setAutosaveArticle;

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    if(loading) return <Loading />;
    
    return <LayoutWithArticleList title='글 작성하기'>
        <p>{message}</p>
        <CellEditor
            initArticle={
                // initArticle?.mode === 'cell' ? initArticle : undefined
                initArticle as CellArticle
            }
            upload={ upload } autosave={ setAutosaveArticle }
        />
    </LayoutWithArticleList>;
}

export default WriteCell;