import GuidePost from 'components/GuidePost';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuide } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { match } from 'react-router-dom';
import Loading from './Loading';

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
                <>
                    <h1> { guide.name } </h1>
                    <div style={{marginBottom: '60px'}}/>

                    <GuidePost text={guide.content}/>
                </>
            ) : (
                <p>해당 가이드가 존재하지 않습니다.</p>
            )}
            <Footer />
        </>
    );
}

export default Guide;