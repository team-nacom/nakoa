import { FormattedMessage, useIntl } from 'react-intl';

interface AuthorInputProps {
    author: string;
    setAuthor: (author: string) => void;
}

function AuthorInput({ author, setAuthor } : AuthorInputProps) {
    let intl = useIntl();

    return (
        <div className='writeForm'>
            <label>
                { intl.formatMessage({ id: 'editor.author' }) }
            </label>
            <div>
                <input 
                    value={ author }
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
        </div>
    )
}

export default AuthorInput;