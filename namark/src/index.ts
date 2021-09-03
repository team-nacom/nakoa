// import { Node } from 'unist';
import { Plugin } from 'unified';
import { Root } from 'mdast';

const naMark : Plugin<void[], Root, Root> = () => {
    var self : any = this;
    var data = self.data();

    function add(field: string, value: unknown) {
        const list : unknown[] = data[field] ? data[field] : (data[field] = [])
    
        list.push(value)
    }
}
