import { editGuide, getGuide, GuideType } from 'etc/api/guide';
import React from 'react';
import usePromise from 'etc/usePromise';
import { match, Redirect } from 'react-router-dom';
import GuideEditor from 'components/GuideEditor';
import Header from 'components/Header';
import Footer from 'components/Footer';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function GuideEdit({ match }: Props) {
    let index = Number.parseInt(match.params.id);
    let [guideLoading, guide] = usePromise(() => getGuide(index), [index]);
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let upload = (guide: GuideType, setMessage: (message: string) => void) => {
        if (!guide.name || !guide.content || !guide.priority || !guide.cate || !guide.gory || guide.authors.length < 1) {
            setMessage('모든 항목을 채워주세요.');
            return;
        }

        editGuide(index, guide).then((success) => {
            if (success) {
                setMessage('성공적으로 수정했습니다!');
                setRedirectTo(`/guide/${index}`);
            }
            else setMessage('수정에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    if (guideLoading) return <></>;
    return (
        <>
            <Header/>
            <GuideEditor initialGuide={guide ?? {}} upload={upload} behavior='edit' />
            <Footer/>
        </>
    )
}


export default GuideEdit;