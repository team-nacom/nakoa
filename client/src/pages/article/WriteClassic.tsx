import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { useClassicText } from '#/components/classic-editor/EditorState';

import { Metadata, useMetadataState } from '#/components/editor/MetadataState';

import { autoSaveIntervalMs, localStorageKeys } from '#/misc/consts'

import { ApplyLayout } from '#/layout/Apply';
import { ClassicArticle, postArticle } from '#/api/article';
import { ClassicEditor } from '#/components/editor/ClassicEditor';

function WriteClassic() {
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
    return <ApplyLayout title='글 작성하기'>
        <p>{message}</p>
        <ClassicEditor upload={ upload } />
    </ApplyLayout>;
}

export default WriteClassic;