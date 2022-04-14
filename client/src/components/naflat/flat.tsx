
////// Definition of Flat structure, and its basic functions.

import lodash from 'lodash';

import { Cell, TCell, CellValueType, CellType, CellTypeMap, defaultCellType, defaultValue, isChildAllowed } from './cell'

type Flat = Record<string, Cell>; // Just an alias

// /**
//  * Transform flat into a nested object(bubble), which can be serialized into JSON string.
//  * 
//  * @param f the flat.
//  * @param rootId root cell Id should be specified.
//  * @returns transformed('inflated') object.
//  */
// function inflate(f: Flat, rootId : string) : object {
//     function _inflate(b: Flat, rootId: string) : object{
//         var { id, parentId, childIds
//     , ...others } = b[rootId];
//         if(childIds.length === 0){
//             var children = childIds
//     .map( childId => _inflate(b, childId) );
//             return { ...others, children };
//         }
//         else return { ...others };
//     }

//     try{ return _inflate(f, rootId); }
//     catch(err){
//         return {
//             type: 'parent', //ERROR HANDLER SOMEWHERE?
//             value: '[Error: Invalid Flat]'
//         };
//     }
// }

/**
 * deep copy flat.
 * @param f the flat to clone.
 * @returns a deep copy of the argument.
 */
 function copyFlat(f: Flat) : Flat {
    return lodash.cloneDeep(f);
}

/**
 * returns next available cell id.
 * to be called when a new cell is created.
 * 
 * current implementation : object ids are numeral string starts with 'c' and new id is max + 1.
 * 
 * @param f the flat.
 * @returns an available cell id.
 */
 function generateId(f: Flat) : string{
    let mx = Math.max.apply(
        null,
        Object.keys(f)
            .map( str => parseInt(str.slice(1)) )
            .filter( isFinite )
            .concat(0)
    ) + 1;
    return 'c' + mx;
}

/**
 * returns subflat which root is id.
 * the subflat is not necessarily a flat since f[id] need not to be type root.
 * 
 * @param f the flat.
 * @param id the id.
 * @returns the subflat.
 */
function getSubflat(f: Flat, id: string){
    let sf : Flat = { [id]: f[id] };
    for(let childId of f[id].childIds){
        sf = {...sf, ...getSubflat(f, childId) };
    }
    return sf;
}

/**
 * given the cell id, find the next(delta === 1) or previous (delta === -1) sibling id of it.
 * 
 * @param f the flat.
 * @param id the cell id as pivot.
 * @param delta the difference of target and pivot sibling.
 * @returns the sibling id. If such sibling does not exists, return the argument cell id.
 */
function findSiblingId(f: Flat, id: string, delta: number) : string{
    let pid = f[id].parentId;
    if( pid === undefined ) return id;

    let siblingIds = f[pid].childIds;
    let n = siblingIds.indexOf(id);
    if( n === -1 ) return id; // something went wrong here, but no handling

    if( n + delta < 0 || n + delta >= siblingIds
.length ) return id;

    return siblingIds[n + delta];
}

/**
 * given the cell id, find next(direction >= 0) or previous(direction<0) cell id of it.
 * cells are preordered.
 * if id is undefined, then find last or first(root) cell id based on direction.
 * 
 * @param f 
 * @param id 
 * @param direction if positive, find next cell. otherwise find previous cell.
 * @returns previous cell id.
 */
function findAdjacentId(f: Flat, id: string | undefined, direction: number){
    if(id === undefined){
        let currentId = Object.keys(f)[0];
        while(currentId){
            let pid = f[currentId].parentId;
            if(pid === undefined) break;

            currentId = pid;
        }
        if(direction >= 0){
            while(currentId && f[currentId].childIds.length > 0){
                currentId = f[currentId].childIds[ f[currentId].childIds.length - 1];
            }
        }
        return currentId;
    }
    else if(direction>=0){ //find next : direct children, or 
        if(f[id].childIds.length > 0){
            return f[id].childIds[0]; //direct children
        }
        //if leaf node.
        let currentId = id;
        while(true){
            let parentId = f[currentId].parentId;
            if(parentId === undefined) return id; //this is when id is the last descendant.

            let siblingIds = f[parentId].childIds;
            let n = siblingIds.indexOf(currentId);
            if( n + 1 < siblingIds.length ){
                // not the last sibling;
                return siblingIds[n+1];
            }
            //the last sibling; this level is exhausted.
            currentId = parentId;
        }
    }
    else{ //find previous : the last descendant of prev sibling, or its parent.
        let parentId = f[id].parentId;
        if(parentId === undefined) return id; //this is when id is root.

        let siblingIds = f[parentId].childIds;
        let n = siblingIds.indexOf(id);
        if( n === 0 ) return parentId;

        let currentId = siblingIds[n-1];
        while(f[currentId].childIds.length){
            currentId = f[currentId].childIds[ f[currentId].childIds.length - 1 ];
        }
        return currentId;
    }
}

///// auto label generator.

/**
 * generate label, counted for all cell types.
 * @param flat reference flat.
 * @param id root id to start with.
 * @returns generated string -> number[] object.
 */
function generateAllLabel(flat: Flat, id: string): Record<string, number[]>{
    let obj : Record<string, number[]> = {};
    _generateAllLabel(flat, id, obj, []);
    return obj;

    // flat[id].childIds.reduce((acc: Record<string, number>, childId, idx)=>{
    //     const cell = flat[childId];
    //     const result = autoLabelAll(flat, childId, [...pfix, idx+1])
    //     return acc;
    // }, {})
}
function _generateAllLabel(flat: Flat, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;
    flat[id].childIds.forEach((childId,idx)=>{
        _generateAllLabel(flat, childId, obj, [...prefix, idx + 1]);
    });
}

/**
 * generate label, counted for specific cell types.
 * @param flat reference flat.
 * @param id root id to start with.
 * @returns generated string -> number[] object.
 */
function generateTypedLabel(flat: Flat, id: string): Record<string, number[]>{
    let obj: Record<string, number[]> = {};
    _generateTypedLabel(flat, id, obj, []);
    return obj;
}
function _generateTypedLabel(flat: Flat, id: string, obj: Record<string, number[]>, prefix: number[]){
    obj[id] = prefix;

    const idxObj : Record<string, number> = {};
    flat[id].childIds.forEach((childId,idx)=>{
        const cell = flat[childId];
        let currentType : string = cell.type;
        // may have additional if statements, like...
        // if(cell.type === 'block' && cell.value.blockType === 'theorem'){
        //     currentType = 'block-theorem'
        // }
        const currentTypeNextIdx = idxObj[currentType] = (idxObj[currentType] || 0) + 1;

        _generateTypedLabel(flat, childId, obj, [...prefix, currentTypeNextIdx]);
    });
}


///// Manipulations for reducer.

/**
 * delete children of id in given flat, excluding id itself.
 * this modifies the flat and do not return the copy.
 * @param f the flat to be modified.
 * @param id cell id.
 * @returns the modified flat.
 */
function cascadeChildren(f: Flat, id: string): Flat{
    if(!f[id]) return f;

    for(let childId of f[id].childIds){
        cascadeChildren(f, childId);
        delete f[childId];
    }
    f[id].childIds = [];

    return f;
}

/**
 * update cell value.
 * 
 * @param f flat.
 * @param id cell id.
 * @param value cell value to be replaced.
 * @returns new flat.
 */
function updateCell(f: Flat, id: string, value: any): Flat {
    if(!f[id]) return f;
    
    let newf = {...f};
    // let newf = copyFlat(f);
    newf[id].value = value;
    // newf[id].value = lodash.cloneDeep(value);
    return newf;
}

/**
 * change cell type.
 * WARNING: new cell is set to default value.
 * 
 * @param f flat.
 * @param id cell id.
 * @param type new type.
 * @returns new flat.
 */
function changeCellType(f: Flat, id: string, type: CellType): Flat{
    if(!f[id] || f[id].type === 'root' || f[id].type === type || type === 'root') return f;

    let newf = {...f};
    newf[id].type = type;
    newf[id].value = defaultValue[type];
    cascadeChildren(newf, id);

    return newf;
}

/**
 * create new cell with given id, type and value.
 * 
 * @param f flat.
 * @param id cell id to be created.
 * @param type cell type.
 * @param value initial value of the cell.
 * @returns new flat. cell id is detatched from any other cells.
 */
function createCell(f: Flat, id: string, type: CellType, value: any): Flat{
    if(f[id] || type === 'root') return f;
    
    let newf = copyFlat(f);
    newf[id] = { id, type, value, childIds: [] };

    return newf;
}

/**
 * move existing cell to a children of certain cell.
 * 
 * @param f flat.
 * @param id the cell to move.
 * @param parentId target parent cell id.
 * @param pos (optional) the position of the cell as a child.
 * @returns new flat.
 */
function moveCell(f: Flat, id: string, parentId: string, pos?: number): Flat{
    if(!f[id] || f[id].type === 'root') return f;

    let newf = copyFlat(f);

    // detach
    let oldParentId = f[id].parentId;
    if(oldParentId !== undefined){
        newf[oldParentId].childIds = newf[oldParentId].childIds.filter( childId => childId !== id );
    }

    // attach
    newf[id].parentId = parentId;

    let childIds = newf[parentId].childIds;
    if(pos === undefined){
        //the tail for default.
        pos = childIds.length;
    }
    newf[parentId].childIds.splice(pos,0,id);
    
    return newf;
}

/**
 * create empty child as the children of 
 * id is autogenerated.
 * 
 * @param f flat.
 * @param parentId target parent cell id.
 * @param pos (optional) the position of the new cell as a child.
 * @returns [new flat, generated id].
 */
function createChildCell(f: Flat, parentId: string, type: CellType, pos?: number) : [Flat, string]{
    let id = generateId(f);
    let newf = createCell(f, id, type, defaultValue[type]);

    if(newf === f) return [f, parentId];
    newf = moveCell(newf, id, parentId, pos);
    return [newf, id];
}

/**
 * remove cell from flat. descendants are cascaded.
 * 
 * @param f flat.
 * @param id target cell id to remove.
 * @returns new flat. 
 */
function removeCell(f: Flat, id: string) : Flat{
    if(!f[id] || f[id].type === 'root') return f;

    let newf = copyFlat(f);

    // console.log(f[id].parentId);

    // detach
    let oldParentId = f[id].parentId;
    if(oldParentId !== undefined){
        newf[oldParentId].childIds = newf[oldParentId].childIds.filter( childId => childId !== id );
    }

    // cascade children
    cascadeChildren(newf, id);
    delete newf[id];

    return newf;
}


// re-export
export type { Cell, TCell, CellValueType, CellType, CellTypeMap };
export { defaultCellType, defaultValue, isChildAllowed };

export type { Flat };
export { copyFlat, getSubflat };
export { findSiblingId, findAdjacentId };
export { generateAllLabel, generateTypedLabel };
export { cascadeChildren };
export { changeCellType, updateCell, createCell, moveCell, createChildCell, removeCell };