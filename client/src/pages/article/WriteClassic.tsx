import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { Metadata, useMetadataState } from '#/components/editor/MetadataState';

import { Layout, LayoutWithArticleList } from '#/layout/Layout';
import { ClassicArticle, getAutosaveArticle, setAutosaveArticle, postArticle } from '#/api/article';
import { ClassicEditor } from '#/components/editor/ClassicEditor';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function WriteClassic() {
    const [loading, initArticle] = usePromise(() => getAutosaveArticle(undefined, 'classic'), []);

    // const [loading, initArticle] = usePromise(async () => {
    //     const draft = await getAutosaveArticle(undefined, 'classic');
    //     return draft;
    //     // if(draft !== undefined) return draft;
    //     // return undefined; // this will simplify setting default fields

    //     // return {
    //     //     mode: 'cell',
    //     //     metadata: {
    //     //         title: '',
    //     //         author: '',
    //     //     },
    //     //     text: ''
    //     // };
    // }, []);
    // const [modified, setModified] = useState(false);

    // redirection state
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const upload = useCallback((metadata: Metadata, text: string) => {
        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
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

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    if(loading) return <Loading />;
    
    return <LayoutWithArticleList title='글 작성하기'>
        <p>{message}</p>
        <ClassicEditor
            initArticle={
                // initArticle?.mode === 'classic' ? initArticle : undefined
                initArticle as ClassicArticle
            }
            upload={ upload } autosave={ setAutosaveArticle }
        />
    </LayoutWithArticleList>;
}

export default WriteClassic;