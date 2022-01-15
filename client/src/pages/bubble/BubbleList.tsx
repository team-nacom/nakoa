import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import { BubbleType } from "components/nabubble/types";
import PageTitle from "components/PageTitle";
import { getAllBubbles, getBubblesByAuthor } from "etc/api/bubble";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import React from 'react';
import { Link, useParams } from "react-router-dom";

interface Params {
    author: string;
};

function BubbleList() {
    let params = useParams<Params>();
    let author = React.useMemo(() => params.author, [params]);
    let getBubbles = author ? (() => getBubblesByAuthor(author)) : getAllBubbles;
    let [bubblesLoading, bubbles] = usePromise(getBubbles);

    if (bubblesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' /> 
            <BubbleSidebar on='list'>
                <span>
                    <Link to={'/write'}>
                        <button className='roundButton material-icons'> 
                            create
                        </button>
                    </Link>
                </span>
            </BubbleSidebar>
            <div id='content'>
                <PageTitle>
                    모든 버블 보기
                </PageTitle>
                <div className='bubbleFeedList'>
                    {bubbles?.map((bubble) => <div key={bubble.title} className='bubbleFeed'>
                        <Link to={`/view/${bubble.index}`}>
                            <div className='bubbleFeedContent'>
                                <div className='title'> { bubble.title ? bubble.title : "untitled" } </div>
                                <div className='author'> by { bubble.author ?? "anonymous" } </div>
                                <div className='tags'> { bubble.tags && bubble.tags.map((s) => `#${s} `) } </div> 
                                {/* <div className='content'> { bubble.content.substring(0, 100) } </div> */}
                            </div>
                        </Link>
                    </div>)}
                </div>
            </div>

            <Footer/>
        </>
    );
}

export default BubbleList;