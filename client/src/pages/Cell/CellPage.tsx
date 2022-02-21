import Footer from 'components/Footer';
import Header from 'components/Header';
import { getCell, hideCell, unhideCell, CellType } from 'etc/api/cell';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import BubbleSidebar from 'components/BubbleSidebar';
import Button from 'components/Button';
import { Flat } from 'components/naflat/flat';
import { FlatDisplayComponent } from 'components/naflat/component';


interface Params {
    index: string;
};

function CellPage() {
    let params = useParams<Params>();
    let history = useHistory();
    let index = React.useMemo(() => params.index, [params]);

    let [cell, setCell] = React.useState<CellType>();
    let [cellLoading, _] = usePromise(() => {
        return getCell(index).then(cell => setCell(cell));
    }, [index]);
    let parsedFlatRef = React.useRef<Flat>({});

    React.useEffect(() => {
        let content = cell?.content;
        if (!content) return;

        parsedFlatRef.current = JSON.parse(content) as Flat
        console.log(parsedFlatRef.current);
    }, [cell]);

    let [toggleCell, icon, confirmMesg] = cell?.hidden ? 
        [unhideCell, 'visibility', '정말 이 글을 공개하시겠습니까?'] :
        [hideCell, 'visibility_off', '정말 이 글을 숨기시겠습니까?'];
    

    if (cellLoading) return <Loading/>;
    return (
        <>
            <Header />
            { cell && (
                <BubbleSidebar on='post'>
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm(confirmMesg)) {
                            await toggleCell(index);
                            setCell(await getCell(index));
                        }
                    }}> {icon} </Button>
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        history.push('/write', {copySourceCell: cell});
                    }}> content_copy </Button>
                </BubbleSidebar>
            )}

            <div id='content'>
                { cell && parsedFlatRef.current ? (
                    <div className='cellDisplayWrapper'>
                        <div className='displayText'>
                            <h1 className='title'> { cell.title } </h1>
                            <h2 className='author'> { cell.author } </h2>
                        </div>
                    <FlatDisplayComponent cellId='c0' initialFlat={ parsedFlatRef.current }/>
                    </div>
                ) : (
                    <p> 존재하지 않는 버블입니다. </p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default CellPage;