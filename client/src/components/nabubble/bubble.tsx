
import { BubbleType } from './cellTypes'

interface Data {}

/**
 * Format specification for tree-like document structure 'NaBubble', or simply bubble.
 * Should be generated from JSON (i.e. no circulation) and compatible with unist Node structure.
 */
interface Bubble {
    type : BubbleType;
    value? : unknown;
    data? : Data;
    label? : string;
    children? : Bubble[];
}


interface Cell {
    id : string; //possibly unnecessary??
    type : BubbleType;
    value? : unknown;
    label? : string;
    parentId? : string; //for manipulation.
    childrenId? : string[];
}

type CellRecord = Record<string, Cell>;
interface Flat{
    rootId : string;
    record : CellRecord;
}

function prefixFlat(flat : Flat, prefix : string) : Flat{
    var record : CellRecord = {};
    for(var id in flat.record){
        var flatCopy = { ...flat.record[id] }; //make a copy (shallow)

        flatCopy.id = prefix + flatCopy.id;
        if(typeof flatCopy.parentId !== 'undefined'){
            flatCopy.parentId = prefix + flatCopy.parentId;
        }
        if(typeof flatCopy.childrenId !== 'undefined'){
            flatCopy.childrenId = flatCopy.childrenId.map( id => (prefix+id) );
        }

        record[prefix + id] = flatCopy;
    }
    return {
        rootId : prefix + flat.rootId,
        record : record
    };
}

function flatten(bubble : Bubble) : Flat{
    var {children, ...others} = bubble;

    if(typeof children !== 'undefined'){
        var record : CellRecord = {};
        var childrenId : string[] = [];
        var counter = 0;
        for(var child of children){
            var flatChild = prefixFlat(flatten(child), '_' + String(counter));
            counter++;

            childrenId.push(flatChild.rootId);
            flatChild.record[flatChild.rootId].parentId = '_';

            record = {...record, ...flatChild.record};
        }
        return {
            rootId : '_',
            record : {
                '_' : {id : '_', childrenId, ...others},
                ...record
            }
        }
    }
    else{
        return {
            rootId : '_',
            record : {
                '_' : { id : '_', ...others }
            }
        };
    }
}

function _inflate(fb : Flat) : Bubble{
    var {rootId, record} = fb;
    var {id, parentId, childrenId, ...others} = record[rootId]; //id, parentId : discharge
    if (typeof childrenId !== 'undefined'){
        var children = childrenId.map((childId)=>{
            return _inflate({ rootId : childId, record });
        });
        return { ...others, children };
    }
    else return { ...others };
}

function inflate(fb : Flat) : Bubble{
    try{ return _inflate(fb); }
    catch(e){
        return {
            type: 'parent', //ERROR HANDLER SOMEWHERE?
            value: '[Error : Invalid FlatBubble]'
        };
    }
}

function deepCopyFlat(fb: Flat) : Flat{
    const newFb = {
        rootId : fb.rootId,
        record : {...fb.record}
    };
    for(let key in fb.record){
        const fbEntity = fb.record[key];
        newFb.record[key] = {...fbEntity};
        if(typeof fbEntity.childrenId !== 'undefined'){
            newFb.record[key].childrenId = [...fbEntity.childrenId];
        }
    }

    return newFb;
}


function getCounter(fb: Flat) : number{
    return Math.max.apply(
        null,
        Object.keys(fb.record).map(parseInt)
            .filter((n)=>!isNaN(n))
            .concat(0)
    );
}

function findSibling(fb: Flat, id: string, delta: number) : string{
    const pid = fb.record[id].parentId;
    if( typeof pid === 'undefined' ) return id;

    const siblingId = fb.record[pid].childrenId || [];
    const n = siblingId.indexOf(id);
    if( n === -1) return id; //something went wrong here, but no handling

    return siblingId[n + delta];
}


export type { Bubble, Flat };
export {
    flatten, inflate, deepCopyFlat,
    prefixFlat, getCounter,
    findSibling
};