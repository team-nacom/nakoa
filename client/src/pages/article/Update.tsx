import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { useClassicText } from '#/components/classic-editor/EditorState';
import { useCellData, useRootId, useStructData } from '#/components/cell-editor/store/EditorState'

import { ClassicEditor } from '#/components/editor/ClassicEditor';
import { CellEditor } from '#/components/editor/CellEditor';

import { useMetadataState } from '#/components/editor/MetadataState';

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

import { ApplyLayout } from '#/layout/Apply';
import { IdxType, toIdx, Article, getArticle, updateArticle } from '#/api/article';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function Update() {
    let params = useParams<{ index: string }>();
    let index: IdxType = useMemo(() => toIdx(params.index), [params]);

    // subscribe values
    const metadata = useMetadataState();
    const text = useClassicText();
    const [cellData, rootId, structData] = [useCellData(), useRootId(), useStructData()];

    // redirection state
    const [loading, initArticle] = usePromise(() => getArticle(index), [index]);
    const [redirectTo, setRedirectTo] = useState<string>();
    const [message, setMessage] = useState<string>();

    const upload = useCallback(() => {
        if(initArticle === undefined) return;

        const article: Article = initArticle.mode === 'classic' ? {
            mode: 'classic',
            metadata,
            text
        } : {
            mode: 'cell',
            metadata,
            content: { cellData, rootId, structData }
        }; // should we have separate upload callbacks per mode?

        updateArticle(index, article).then((success)=>{
            if(success){
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/article/view/${index}`);
            } else{
                setMessage('업로드에 실패했습니다.');
            }
        })
    }, [initArticle, metadata, text, cellData, rootId, structData, index]);

    if(redirectTo !== undefined) return <Redirect to={redirectTo} />;
    if(loading) return <Loading />;
    if(initArticle === undefined){
        return <ApplyLayout>
            <p>존재하지 않는 글입니다.</p>
        </ApplyLayout>;
    }

    return <ApplyLayout title='글 수정하기'>
        <p>{message}</p>
        {initArticle.mode === 'classic' &&
            <ClassicEditor initArticle={initArticle} upload={ upload } />
        }
        {initArticle.mode === 'cell' &&
            <CellEditor initArticle={initArticle} upload={ upload } />
        }
    </ApplyLayout>;
}

export default Update;