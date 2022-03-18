import {useState, useCallback} from 'react';
import {message} from 'antd';

/**
 * Hook to retrieve the projections
 * As default, it will retrieve the projections from esps.io
 * (see https://github.com/maptiler/epsg.io#api-for-results 
 * for more details.)
 */
const useGetProjection = () => {
    const [error, setError] = useState(null);
    const [projections, setProjections] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    const clearRequest = useCallback(() => {
        setError(null);
        setProjections(null);
    }, []);

    const doFetch = useCallback((url, fetchOpts) => {
        clearRequest();
        fetch(url, fetchOpts)
        .then(response => {
            if(!response.ok) {
                throw new Error(response);
            }
            return response.json();
        })
        .then(responseData => {
            const results = responseData.results;
            let projs = [];
            if(results && results.length > 0) {
                projs =  results.map(proj => {
                    return {
                        value:proj.name,
                        projection: proj
                    }
                });
            } 
            setProjections(projs);
        })
        .catch(error => {
            message.info(error.message);
            setError(error);
        });
    }, [clearRequest]);

    const sendRequest = useCallback((
        value,
        delay = 1000,
        fetchOpts = {
            method: 'GET',
            format: 'json'
        },
        url = 'https://epsg.io?' + new URLSearchParams({
            q: value? value : undefined,
            format:'json'
        }),
        
        ) => {
            const newTimeoutId = setTimeout(() => {
                doFetch(url, fetchOpts);
            }, delay);
            setTimeoutId(newTimeoutId);

    }, [doFetch]);


    return [sendRequest, clearRequest, projections, timeoutId, error];

};

export default useGetProjection;