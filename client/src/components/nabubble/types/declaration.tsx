interface bubbleMap<T>{
    parent: T;
    text: T;
}

type bubbleType = keyof bubbleMap<string>;

export type { bubbleType, bubbleMap };