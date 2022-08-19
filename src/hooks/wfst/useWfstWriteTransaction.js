import { useState, useCallback } from 'react';
import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';
import defined from '../../core/defined';


/**
 * Hook to send a wfst transaction request to create/update/delete features
 * @returns 
 */
const useWfstWriteTransaction = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const clearRequest = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);
    }, []);

    const sendRequest = useCallback((url, newFeatures, updatedFeatures, deletedFeatures, wfsOptions) => {
        //create gml formatter based on the wfs options
        const formatGML = new GML(wfsOptions);
        //create the wfs request
        const formatWFS = new WFS();
        const node = formatWFS.writeTransaction(
            (defined(newFeatures) ? newFeatures.getArray() : null), 
            (defined(updatedFeatures) ? updatedFeatures.getArray() : null), 
            (defined(deletedFeatures) ? deletedFeatures.getArray() : null), 
            formatGML
        );
        //serialize request
        const xs = new XMLSerializer();
        const payload = xs.serializeToString(node);
        //send request
        console.log('WFST WriteTransaction Request: ');
        console.log(payload);
        const fetchOptions = {
            method: 'POST', 
            contentType: 'application/xml',
            body: payload
        };
        setIsLoading(true);
        setError(null);
        setData(null);

        fetch(url, fetchOptions)
        .then(response => {
            if(!response.ok) {
                throw new Error(response);
            }
            return response.text();
        })
        .then((responseData) => {
            console.log(responseData);
            //const response = formatWFS.readTransactionResponse(responseData);
            //console.log(response);
            setData(responseData);
            setIsLoading(false);
        })
        .catch(error => {
            alert(error.message);
            setError(error.message);
            setIsLoading(false);
        });

    }, []);

    return {
        sendRequest,
        clearRequest,
        isLoading,
        data,
        error
    };
};

export default useWfstWriteTransaction;