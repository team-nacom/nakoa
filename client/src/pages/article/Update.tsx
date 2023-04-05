import { useEffect, useState, useMemo, useCallback } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import { ClassicEditor } from '#/components/editor/ClassicEditor';
import { CellEditor } from '#/components/editor/CellEditor';

import { Metadata } from '#/components/editor/MetadataState';

import { Layout } from '#/layout/Layout';

import type { Article, ClassicArticle, CellArticle } from '#/components/cell-editor/types';
import { getLocalArticle, updateLocalArticle, getDraftArticle, setDraftArticle, unsetDraftArticle } from '#/api/article-local-idb';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';
import Button from '#/components/Button';

function Update() {
    const { localIndex } = useParams<{ localIndex: string }>();

    const navigate = useNavigate();

    const [loading, initArticle] = usePromise(async () => {
        const draft = await getDraftArticle(localIndex);
        // console.log('draft', draft);
        if(draft !== undefined) return draft;

        const article = await getLocalArticle(localIndex!);
        // console.log('article', article);
        return article;
    }, [localIndex]);

    const [message, setMessage] = useState<string>();

    const uploadClassic = useCallback(async (metadata: Metadata, text: string) => {
        if(metadata.title === ''){
            window.alert('제목을 입력해 주세요.');
            return;
        }

        const article: ClassicArticle = {
            ...initArticle, // localIndex, publicIndex, createDate, updateDate
            mode: 'classic',
            metadata,
            text
        };

        let { success } = await updateLocalArticle(localIndex!, article);
        if(success){
            setMessage('업로드에 성공했습니다!');

            navigate(`/article/view/${localIndex}`); // end of page
        } else{
            setMessage('업로드에 실패했습니다.');
        }
    }, [localIndex, initArticle]);

    const autosaveClassic = useCallback(async (metadata: Metadata, text: string) => {
        const article: ClassicArticle = {
            ...initArticle, // localIndex, publicIndex, createDate, updateDate
            mode: 'classic',
            metadata,
            text
        };

        // console.log('autosave init', initArticle);
        // console.log('autosave target', article);

        await setDraftArticle(article, localIndex);
    }, [localIndex, initArticle]);

    const autosaveCell = useCallback(async (metadata: Metadata, content: CellArticle['content']) => {
        const article: CellArticle = {
            ...initArticle, // localIndex, publicIndex, createDate, updateDate
            mode: 'cell',
            metadata,
            content
        };
        await setDraftArticle(article);
    }, [initArticle]);

    const uploadCell = useCallback(async (metadata: Metadata, content: CellArticle['content']) => {
        if(metadata.title === ''){
            window.alert('제목을 입력해 주세요.');
            return;
        }

        const article: CellArticle = {
            ...initArticle, // localIndex, publicIndex, createDate, updateDate
            mode: 'cell',
            metadata,
            content
        };

        let success = await updateLocalArticle(localIndex!, article);
        if(success){
            setMessage('업로드에 성공했습니다!');
            navigate(`/article/view/${localIndex}`);
        } else{
            setMessage('업로드에 실패했습니다.');
        }
    }, [localIndex, initArticle]);

    const removeAutosave = useCallback(async (disableAutosave: () => any) => {
        if(!window.confirm('정말 임시저장을 초기화하시겠습니까?')) return;

        disableAutosave();
        await unsetDraftArticle(localIndex);

        navigate(`/article/update/${localIndex}`);
    }, [localIndex]);

    if(loading) return <Loading />;
    if(initArticle === undefined){ // todo: fallback into list
        return <Layout title='오류' sidebar='ArticleList'>
            <p>존재하지 않는 글입니다.</p>
        </Layout>;
    }

    return <Layout title='글 수정하기' sidebar='ArticleList'>
        <p>{message}</p>
        {initArticle.mode === 'classic' &&
            <ClassicEditor
                initArticle={initArticle}
                upload={ uploadClassic } autosave={ autosaveClassic }
                removeAutosave={ removeAutosave }
            />
        }
        {initArticle.mode === 'cell' &&
            <CellEditor
                initArticle={initArticle}
                upload={ uploadCell } autosave={ autosaveCell }
                removeAutosave={ removeAutosave }
            />
        }
    </Layout>;
}

export default Update;