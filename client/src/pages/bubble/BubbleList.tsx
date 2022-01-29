import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getAllBubbles, getBubblesByAuthor, BubbleType } from "api/bubble";
import usePromise from "utils/usePromise";
import Loading from "pages/Loading";
import React from 'react';
import { Link, useParams } from "react-router-dom";
import AuthorInput from '../../components/AuthorInput';
import Button from '../../components/Button';

interface Params {
    author: string;
};

function BubbleList() {
    let params = useParams<Params>();
    let storedAuthor = localStorage.getItem('author');
    let [author, setAuthor] = React.useState<string>(storedAuthor ?? '');
    React.useEffect(() => {
        localStorage.setItem("author", author);
    }, [author]);

    let [bubbles, setBubbles] = React.useState<BubbleType[]>([]);
    let [bubblesLoading, _] = usePromise(() => 
        getBubblesByAuthor(author).then(bubblesFetch => setBubbles(bubblesFetch)));

    return (
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
                    글 검색
                </PageTitle>
                
                <div className='writeBox guide'>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setBubbles(await getBubblesByAuthor(author));
                    }} id='authorForm'>
                        <div className='flexbox'>
                            <AuthorInput author={author} setAuthor={setAuthor} />
                            <input type="submit" style={{display: 'none'}} />
                        </div>

                        <div className='editorBottom'>
                            <Button className='submit link' onClick={async (e) => {
                                setBubbles(await getBubblesByAuthor(author));
                            }}>
                                검색
                            </Button>
                        </div>
                    </form>
                </div>

                { !bubblesLoading && bubbles && bubbles.length > 0 && 
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
                }
            </div>

            <Footer/>
        </>
    );
}

export default BubbleList;