import {useState, useCallback} from 'react';
import {message} from 'antd';


/**
 * Hook to retrieve the results from the
 * <a href="https://nominatim.org/release-docs/latest/api/Search/">
 *  Nominatim Geocoder
 * </a>
 * 
 */
const useNominatimGeocoder = () => {

    const [error, setError] = useState(null);
    const [places, setPlaces] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    const clearRequest = useCallback(() => {
        setError(null);
        setPlaces(null);
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
            const features = responseData.features;
            let places = [];
            if(features && features.length > 0) {
                places =  features.map(feature => {
                    return {
                        label:feature.properties.display_name,
                        value:feature.properties.place_id.toString(),
                        feature: feature
                    }
                });
            } 
            places.reverse();
            setPlaces(places);
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
        ) => {
            const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
                q: value? value : undefined,
                format:'geojson'
            });
            const newTimeoutId = setTimeout(() => {
                doFetch(url, fetchOpts);
            }, delay);
            setTimeoutId(newTimeoutId);

    }, [doFetch]);
    
    return [sendRequest, clearRequest, places, timeoutId, error];

};

export default useNominatimGeocoder;
