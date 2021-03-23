import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuide } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { match } from 'react-router-dom';
import Loading from './Loading';
import { title } from 'process';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function Guide({ match } : Props) {
    let id = Number.parseInt(match.params.id);
    let [guideLoading, guide] = usePromise(() => getGuide(id));
    
    if (guideLoading) return <Loading/>;
    return (
        <>
            <Header />

            { guide ? (
                <GuideView title={ guide.name } subtitle='부제' text={guide.content} />
            ) : (
                <p>404 : 해당 가이드가 존재하지 않습니다.</p>
            )}
            <Footer />
        </>
    );
}
export default Guide;