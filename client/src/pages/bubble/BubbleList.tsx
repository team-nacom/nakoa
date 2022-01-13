import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import { BubbleType } from "components/nabubble/types";
import PageTitle from "components/PageTitle";
import { getBubbles } from "etc/api/bubble";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import { Link } from "react-router-dom";


function BubbleList() {
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
                    {bubbles?.map((bubble) => <div key={bubble.name} className='bubbleFeed'>
                        <Link to={`/view/${bubble.index}`}>
                            <div className='bubbleFeedContent'>
                                <div className='title'> { bubble.name } </div>
                                <div className='tags'> { bubble.tags && bubble.tags.map((s) => `#${s} `) } </div> 
                                <div className='content'> { bubble.content.substring(0, 100) } </div>
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