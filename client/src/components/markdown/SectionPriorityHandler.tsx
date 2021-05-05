import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';

const SectionPriorityHandler : Plugin = () => {
    const sectionPriorityHandler : Transformer = (tree, file) => {
        const root = tree as Parent;
        const markers = ['A','B','C','D','E','+']; //+ for legacy.
        const prio = [1,2,3,4,5,0];

        for(const node of root.children){
            if(node.type === 'paragraph'
            && 'children' in node
            && Array.isArray(node.children) //no type guards for instances, seriously?
            && node.children[0].type === 'text'){
                const str = node.children[0].value as string;
                
                for(const i in markers){
                    const marker = markers[i] + ' ';
                    const h = str.indexOf(marker);
                    
                    if(h !== -1 && [undefined,'#','##','###','####','#####','######'].indexOf(str.slice(0,h)) !== -1 ){ //indexOf result should be equal to h
                        node.children[0].value = str.slice(h + marker.length).trimStart();
                        node.type = 'heading';
                        node.depth = h;
                        node.data = {
                            priority : prio[i]
                        }
                        break;
                    }
                }
            }
            else if(node.type === 'heading'
            && 'children' in node
            && Array.isArray(node.children)){
                //ensuring height
                if(node.children.length === 0){
                    node.children.push({
                        type: 'text',
                        value: '　' //whitespace with height;
                    })
                }
                node.data = {
                    priority : 1 //same as Essential
                    // priority : -1 //unnumbered
                }
            }
        }
    }

    return sectionPriorityHandler;
}

export default SectionPriorityHandler;