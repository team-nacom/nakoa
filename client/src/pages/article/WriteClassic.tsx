import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Metadata, useMetadataState } from '#/components/editor/MetadataState';

import { Layout } from '#/layout/Layout';

import type { ClassicArticle } from '#/components/cell-editor/types';
import { getDraftArticle, setDraftArticle, unsetDraftArticle, postLocalArticle } from '#/api/article-local-idb';
import { ClassicEditor } from '#/components/editor/ClassicEditor';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';
import Button from '#/components/Button';

function WriteClassic() {
    const navigate = useNavigate();

    const [loading, initArticle] = usePromise(() => getDraftArticle(undefined, 'classic'), []);

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

    const [message, setMessage] = useState<string>();
    
    const upload = useCallback(async (metadata: Metadata, text: string) => {
        if(metadata.title === ''){
            window.alert('제목을 입력해 주세요.');
            return;
        }

        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
        };

        let { success, localIndex } = await postLocalArticle(article);
        if(success){
            setMessage('저장에 성공했습니다!');
            navigate(`/article/view/${localIndex}`);
        } else{
            setMessage('저장에 실패했습니다.');
        }
    }, []);

    const autosave = useCallback(async (metadata: Metadata, text: string) => {
        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
        };
        await setDraftArticle(article);
    }, []);

    const removeAutosave = useCallback(async (disableAutosave: () => any) => {
        if(!window.confirm('정말 임시저장을 초기화하시겠습니까?')) return;

        disableAutosave();
        await unsetDraftArticle(undefined, 'classic');

        navigate(`/article/write-classic`);
    }, []);

    if(loading) return <Loading />;
    
    return <Layout title='글 작성하기' sidebar='ArticleList'>
        <p>{message}</p>
        <ClassicEditor
            initArticle={
                // initArticle?.mode === 'classic' ? initArticle : undefined
                initArticle as ClassicArticle
            }
            upload={ upload }
            autosave={ autosave }
            removeAutosave={ removeAutosave }
        />
    </Layout>;
}

export default WriteClassic;