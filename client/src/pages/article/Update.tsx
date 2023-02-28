import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { ClassicEditor } from '#/components/editor/ClassicEditor';
import { CellEditor } from '#/components/editor/CellEditor';

import { Metadata } from '#/components/editor/MetadataState';

import { Layout, LayoutWithArticleList } from '#/layout/Layout';
import { Article, getArticle, updateArticle, ClassicArticle, CellArticle, getAutosaveArticle, setAutosaveArticle, unsetAutosaveArticle } from '#/api/article';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';
import Button from '#/components/Button';

function Update() {
    let params = useParams<{ index: string }>();
    let index = params.index;

    // redirection state
    const [loading, initArticle] = usePromise(async () => {
        const draft = await getAutosaveArticle(index);
        if(draft !== undefined) return draft;
        return await getArticle(index);
    }, [index]);
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const uploadClassic = useCallback((metadata: Metadata, text: string) => {
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

        const article: ClassicArticle = {
            mode: 'classic',
            metadata,
            text
        };

        updateArticle(index, article).then((success)=>{
            if(success){
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/article/view/${index}`);
            } else{
                setMessage('업로드에 실패했습니다.');
            }
        })
    }, [index]);

    const uploadCell = useCallback((metadata: Metadata, content: CellArticle['content']) => {
        if(metadata.title === ''){
            alert('제목을 입력해 주세요.');
            return;
        }

        const article: CellArticle = {
            mode: 'cell',
            metadata,
            content
        };

        updateArticle(index, article).then((success)=>{
            if(success){
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/article/view/${index}`);
            } else{
                setMessage('업로드에 실패했습니다.');
            }
        });
    }, [index]);

    const removeAutosave = useCallback(async () => {
        if(!window.confirm('정말 임시저장을 초기화하시겠습니까?')) return;
        await unsetAutosaveArticle(index);
        // setRedirectTo(`/article/update/${index}`); // might race??
        window.location.reload();
    }, [index]);

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    if(loading) return <Loading />;
    if(initArticle === undefined){ // todo: fallback into list
        return <LayoutWithArticleList>
            <p>존재하지 않는 글입니다.</p>
        </LayoutWithArticleList>;
    }

    return <LayoutWithArticleList title='글 수정하기'>
        <p>{message}</p>
        {initArticle.mode === 'classic' &&
            <ClassicEditor
                initArticle={initArticle}
                upload={ uploadClassic }
                autosave={ (article) => { setAutosaveArticle(article, index); } }
            />
        }
        {initArticle.mode === 'cell' &&
            <CellEditor
                initArticle={initArticle}
                upload={ uploadCell }
                autosave={ (article) => { setAutosaveArticle(article, index); } }
            />
        }
        <Button onClick = { removeAutosave }>임시저장 초기화</Button>
    </LayoutWithArticleList>;
}

export default Update;