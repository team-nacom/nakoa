import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any>,
};

function Button(props : Props) {
    let [loading, setLoading] = React.useState<boolean>(false);
    let [suspended, setSuspended] = React.useState<boolean>(false);

    let { onClick, disabled, ...otherProps} = props;

    let realOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        setSuspended(true);
        setLoading(true);

        if (onClick) {
            onClick(e).then(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
        setTimeout(() => {
            setSuspended(false);
        }, 1000);
    }
    
    return (
        <button onClick={realOnClick} disabled={disabled || loading || suspended} {...otherProps} >
            { props.children }
        </button>
    );
}

export default Button;