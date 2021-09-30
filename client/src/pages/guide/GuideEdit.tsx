import { editGuide, getGuide, GuidePost } from 'etc/api/guide';
import React from 'react';
import usePromise from 'etc/usePromise';
import { Redirect, useParams } from 'react-router-dom';
import GuideEditor from 'components/GuideEditor';
import Header from 'components/Header';
import Footer from 'components/Footer';

interface Params {
    id: string;
};


function GuideEdit() {
    let { id: idStr } = useParams<Params>();
    let id = Number.parseInt(idStr);
    let [guideLoading, guide] = usePromise(() => getGuide(id), [id]);
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let upload = async (guide: GuidePost, setMessage: (message: string) => void) => {
        if (!guide.name || !guide.content || /*!guide.priority || !guide.cate || !guide.gory ||*/ guide.authors.length < 1) {
            setMessage('모든 항목을 채워주세요.');
            return;
        }

        setTimeout(() => {
            editGuide(id, guide).then((success) => {
                if (success) {
                    setMessage('성공적으로 수정했습니다!');
                    setRedirectTo(`/guide/${id}`);
                }
                else setMessage('수정에 실패했습니다...');
                return;
            })
        }, 2000);
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    if (guideLoading) return <></>;
    return (
        <>
            <Header/>
            <GuideEditor initialGuide={guide} upload={upload} behavior='edit' />
            <Footer/>
        </>
    )
}


export default GuideEdit;