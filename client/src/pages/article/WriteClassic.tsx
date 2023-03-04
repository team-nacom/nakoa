import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { Metadata, useMetadataState } from '#/components/editor/MetadataState';

import { Layout } from '#/layout/Layout';
import { ArticleListSidebar } from '#/layout/Sidebar';
import { ClassicArticle, getAutosaveArticle, setAutosaveArticle, unsetAutosaveArticle, postArticle } from '#/api/article';
import { ClassicEditor } from '#/components/editor/ClassicEditor';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';
import Button from '#/components/Button';

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
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

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

    const removeAutosave = useCallback(async (disableAutosave: () => any) => {
        if(!window.confirm('정말 임시저장을 초기화하시겠습니까?')) return;

        disableAutosave();
        await unsetAutosaveArticle(undefined, 'classic');
        setRedirectTo(`/article/write-classic`); // might race??

        window.location.reload();
    }, []);

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    if(loading) return <Loading />;
    
    return <Layout title='글 작성하기' sidebar={ <ArticleListSidebar /> }>
        <p>{message}</p>
        <ClassicEditor
            initArticle={
                // initArticle?.mode === 'classic' ? initArticle : undefined
                initArticle as ClassicArticle
            }
            upload={ upload }
            autosave={ setAutosaveArticle }
            removeAutosave={ removeAutosave }
        />
    </Layout>;
}

export default WriteClassic;