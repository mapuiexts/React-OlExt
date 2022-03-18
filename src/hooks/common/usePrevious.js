import {useEffect, useRef} from 'react';

/**
 * Custom Hook to get the previous props or state
 * See: https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * See: https://medium.com/better-programming/updating-state-from-properties-with-react-hooks-5d48693a4af8
 * @param {*} value 
 */
const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
};

export default usePrevious;
