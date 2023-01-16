import { ChildrenWrapperProps } from './Portal'

export function ChildrenWrapper({ children, hide }: ChildrenWrapperProps){
    return <div className={'cellChildrenWrapper'+ (hide ? ' childrenContainerHiddenEditor' : '')}>
        { children }
    </div>
}