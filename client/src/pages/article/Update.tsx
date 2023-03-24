import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { ClassicEditor } from '#/components/editor/ClassicEditor';
import { CellEditor } from '#/components/editor/CellEditor';

import { Metadata } from '#/components/editor/MetadataState';

import { Layout } from '#/layout/Layout';

import { Article, getLocalArticle, updateLocalArticle, ClassicArticle, CellArticle, getAutosaveArticle, setAutosaveArticle, unsetAutosaveArticle } from '#/api/article-local';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';
import Button from '#/components/Button';

function Update() {
    const { localIndex } = useParams<{ localIndex: string }>();

    const [loading, initArticle] = usePromise(async () => {
        const draft = await getAutosaveArticle(localIndex);
        if(draft !== undefined) return draft;
        return await getLocalArticle(localIndex);
    }, [localIndex]);

    // redirection state
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const uploadClassic = useCallback(async (metadata: Metadata, text: string) => {
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
        };

        let success = await updateLocalArticle(localIndex, article);
        if(success){
            setMessage('업로드에 성공했습니다!');
            setRedirectTo(`/article/view/${localIndex}`);
        } else{
            setMessage('업로드에 실패했습니다.');
        }
    }, [localIndex]);

    const autosaveClassic = useCallback(async (metadata: Metadata, text: string) => {
        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
        };
        await setAutosaveArticle(article, localIndex);
    }, [localIndex]);

    const autosaveCell = useCallback(async (metadata: Metadata, content: CellArticle['content']) => {
        const article: CellArticle = {
            mode: 'cell',
            metadata,
            content
        };
        await setAutosaveArticle(article);
    }, []);

    const uploadCell = useCallback(async (metadata: Metadata, content: CellArticle['content']) => {
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

        const article: CellArticle = {
            mode: 'cell',
            metadata,
            content
        };

        let success = await updateLocalArticle(localIndex, article);
        if(success){
            setMessage('업로드에 성공했습니다!');
            setRedirectTo(`/article/view/${localIndex}`);
        } else{
            setMessage('업로드에 실패했습니다.');
        }
    }, [localIndex]);

    const removeAutosave = useCallback(async (disableAutosave: () => any) => {
        if(!window.confirm('정말 임시저장을 초기화하시겠습니까?')) return;

        disableAutosave();
        await unsetAutosaveArticle(localIndex);
        setRedirectTo(`/article/update/${localIndex}`); // might race??

        window.location.reload();
    }, [localIndex]);

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
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