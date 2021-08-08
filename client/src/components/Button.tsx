import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any,
};

function Button(props : Props) {
    let [loading, setLoading] = React.useState<boolean>(false);

    let { onClick, disabled, ...otherProps} = props;

    let realOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        setLoading(true);
        if (onClick) onClick(e);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
    
    return (
        <button onClick={realOnClick} disabled={disabled || loading} {...otherProps} >
            { props.children }
        </button>
    );
}

export default Button;