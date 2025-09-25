import { useState, useEffect } from 'react';
import placeholders from '../start_phrases.json';
import { getRandomInt } from '../utils/math';

function SearchInput({ setQuery }) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders.landing_input[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomIndex = getRandomInt(placeholders.landing_input.length);
            setCurrentPlaceholder(placeholders.landing_input[randomIndex]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const handleOnChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <input type="text" onChange={handleOnChange} placeholder={currentPlaceholder} />
    );
}

export default SearchInput;