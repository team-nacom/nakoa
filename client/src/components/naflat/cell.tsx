////// Definition of Cell and its types

interface CellBase{
    id: string;
    parentId?: string; //root has no parent.
    childIds: string[];
}

type CellValueType = {
    'root': {
        mathMacro: string
    },
    'section': {
        heading: string,
        hideChildren: boolean
    },
    'text': string,
    'math': string,
    'code': {
        language: string,
        contents: string
    },
    'image': {
        src: string,
        caption: string
    },
};

type CellType = keyof CellValueType;
const defaultCellType : CellType = 'text';

const defaultValue : { [cellType in CellType]: CellValueType[cellType] } = {
    'root': { mathMacro: '' },
    'section': { heading: '', hideChildren: false },
    'text': '',
    'math': '',
    'code': { language: '', contents: '' },
    'image': { src: '/altImg.png', caption: '' },
}

// TV stands for cell type & value.
type TCellTV<cellType extends CellType> = {
    type: cellType;
    value: CellValueType[cellType];
}
type TCell<cellType extends CellType> = CellBase & TCellTV<cellType>;

type CellTV = ({
    [cellType in CellType] : TCellTV<cellType>
})[CellType]; // union of generic type!!
type Cell = CellBase & CellTV;

type CellTypeMap<T> = {
    [cellType in CellType]: T;
};


const isChildAllowed = (type: CellType) => {
    return (type === 'root' || type === 'section');
}


export type { Cell, CellTV, TCell, CellValueType, CellType, CellTypeMap };
export { defaultCellType, defaultValue };
export { isChildAllowed };