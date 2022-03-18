import { useState, useCallback } from 'react'


const useWFSDescribeFeatureType = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const sendRequest = useCallback( async (url, featureType,
        wfsOpts = {
            version: '1.1.0',
            exceptions: 'application/vnd.ogc.se_xml',
            outputFormat: 'application/json'

        }, 
        fetchOptions = {
            method: 'GET'
        }
    ) => {
        //build WFS request
        const typeName =  (wfsOpts.version === '1.1.0' || wfsOpts.version === '1.0.0' ? 'typeName': 'typeNames');
        url = url + '?service=wfs&request=DescribeFeatureType' +
            '&version=' + wfsOpts.version +
            '&' + typeName + '=' + featureType +
            '&outputFormat=' + wfsOpts.outputFormat +
            '&exceptions=' + wfsOpts.exceptions;
        //format fetch options with the content type
        setIsLoading(true);
        setError(null);
        setData(null);
        //fetch data
        fetch(url, fetchOptions)
        .then(response => {
            if(!response.ok) {
               throw new Error(response);
            }
            return response.json();
        })
        .then(responseData => {
            //parse the features and add them to the layer source
            setIsLoading(false);
            setData(responseData);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });

    }, []);

    const clearRequest = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);
    }, []);
	
    return {
        sendRequest,
        clearRequest,
        isLoading,
        data,
        error
    };
};

export default useWFSDescribeFeatureType;