import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { Metadata, useMetadataState } from '#/components/editor/MetadataState';

import { ApplyLayout } from '#/layout/Apply';
import { ClassicArticle, getAutosaveArticle, setAutosaveArticle, postArticle } from '#/api/article';
import { ClassicEditor } from '#/components/editor/ClassicEditor';

function WriteClassic() {
    const initArticle: ClassicArticle | undefined = useMemo(()=>{
        const article = getAutosaveArticle(undefined, 'classic');
        if(article === undefined || article.mode !== 'classic'){
            return undefined; // this will simplify setting default fields
            // return {
            //     mode: 'classic',
            //     metadata: {
            //         title: '',
            //         author: '',
            //     },
            //     text: ''
            // };
        }
        return article;
    }, []);
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
    return <ApplyLayout title='글 작성하기'>
        <p>{message}</p>
        <ClassicEditor initArticle={ initArticle }
            upload={ upload } autosave={ setAutosaveArticle }
        />
    </ApplyLayout>;
}

export default WriteClassic;