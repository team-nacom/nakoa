import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import { useMetadataState, Metadata } from '#/components/editor/MetadataState';

import { Layout, LayoutWithArticleList } from '#/layout/Layout';
import usePromise from '#/misc/usePromise';
import { Article, CellArticle, getArticle, postArticle, getAutosaveArticle, setAutosaveArticle } from '#/api/article';
import { CellEditor } from '#/components/editor/CellEditor';

function WriteCell() {
    const initArticle: CellArticle | undefined = useMemo(()=>{
        const article = getAutosaveArticle(undefined, 'cell');
        if(article === undefined || article.mode !== 'cell'){
            return undefined; // this will simplify setting default fields
            // return {
            //     mode: 'cell',
            //     metadata: {
            //         title: '',
            //         author: '',
            //     },
            //     content: {
            //         rootId: 'c0',
            //         structData: { 'c0': [] },
            //         cellData: { 'c0': { id: 'c0', [cellTypeStr]: 'root', mathMacroStr: '', } }
            //     }
            // };
        }
        return article;
    }, []);
    // const [modified, setModified] = useState(false);

    // redirection state
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const upload = useCallback((metadata: Metadata, content: CellArticle['content']) => {
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
    return <LayoutWithArticleList title='글 작성하기'>
        <p>{message}</p>
        <CellEditor initArticle={ initArticle }
            upload={ upload } autosave={ setAutosaveArticle }
        />
    </LayoutWithArticleList>;
}

export default WriteCell;