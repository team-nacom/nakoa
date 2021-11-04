interface BubbleMap<T>{
    parent: T;
    text: T;
    math: T;
    code: T;
}

type BubbleType = keyof BubbleMap<string>;

type BubbleBehaviorList = 'parent' | 'text';
const bubbleBehavior : BubbleMap<BubbleBehaviorList> = {
    parent: 'parent',
    text: 'text',
    math: 'text',
    code: 'text',
}

export type { BubbleType, BubbleMap };
export { bubbleBehavior };