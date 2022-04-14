import { FormattedMessage, useIntl } from 'react-intl';

interface AuthorInputProps {
    author: string;
    setAuthor: (author: string) => void;
}

function AuthorInput({ author, setAuthor } : AuthorInputProps) {
    let intl = useIntl();

    return (
        <div className='authorInput'>
            <label>
                { intl.formatMessage({ id: 'editor.author' }) }
            </label>
            <input 
                value={ author }
                onChange={(e) => setAuthor(e.target.value)}
            />
        </div>
    )
}

export default AuthorInput;