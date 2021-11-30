import { refsType, dispatchType } from "./handlers";

interface CellOptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    parentId : string,
    cellId : string,
    evalSiblingId : () => string[]
    refs : refsType
    dispatch : dispatchType
}

function CellOptionButton1({parentId, cellId, refs, evalSiblingId, dispatch, ...others} : CellOptionButtonProps){
    return (
        <button className='cellOptionButton material-icons'>
            delete
        </button>
    )
}

function CellOptionButton2({parentId, cellId, refs, evalSiblingId, dispatch, ...others} : CellOptionButtonProps){
    return (
        <button className='cellOptionButton material-icons'>
            calculate
        </button>
    )
}

function CellOptionButton3({parentId, cellId, refs, evalSiblingId, dispatch, ...others} : CellOptionButtonProps){
    return (
        <button className='cellOptionButton material-icons'>
            code
        </button>
    )
}

function SideBlockHelper(props: CellOptionButtonProps) {
    return (
        <div className='sideBlockHelper'>
            <CellOptionButton1 {...props} />
            <CellOptionButton2 {...props} />
            <CellOptionButton3 {...props} />
        </div>
    );
}

export default SideBlockHelper;