import { useState, useCallback } from 'react'
import WFS from 'ol/format/WFS';
import GeoJSON from 'ol/format/GeoJSON';
import GML2 from 'ol/format/GML2';
import GML3 from 'ol/format/GML3';
import GML32 from 'ol/format/GML32';

const useWFSGetFeature = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    //const [features, setFeatures] = useState[null]

    const sendRequest = useCallback((url, map, layer, wfsOptions, fetchOptions = {
        method: 'POST', 
        contentType: 'application/xml',

    }) => {
        //build WFS request
        const featureRequest = new WFS().writeGetFeature(wfsOptions);
        const data = new XMLSerializer().serializeToString(featureRequest);
        //log for testing
        console.log('WFS GetFeature Request: ');
        console.log(data);
        //format fetch options with the content type
        setIsLoading(true);
        setError(null);
        fetchOptions = {
            ...fetchOptions, 
            method: 'POST',
            contentType: 'application/xml', 
            body: data,
            //dataType: 'json'
        };
        //fetch data
        fetch(url, fetchOptions)
        .then(response => {
            if(!response.ok) {
               throw new Error(response);
            }
            //return response.json();
            return response.text();
        })
        .then(responseData => {
            console.log('WFS GetFeature Response:', responseData);
            let parser = null;
            let outputFormat = wfsOptions.outputFormat;
            if(outputFormat) outputFormat = outputFormat.toUpperCase();
            switch(outputFormat) {
                case 'APPLICATION/JSON':
                    parser = new GeoJSON();
                    break;
                case 'GML2':
                    parser = new GML2();
                    break;
                case 'GML3':
                    parser = new GML3();
                    break;
                case 'GML32':
                    parser = new GML32();
                    break;
                default:
                    parser = new GML3();
            }
            const features = parser.readFeatures(responseData);
            //const xml = (new window.DOMParser()).parseFromString(responseData, "text/xml")
            //const features = parser.readFeatures(xml);
            layer.getSource().addFeatures(features);
            setIsLoading(false);
        })
        .catch(error => {
            alert(error.message);
            setError(error.message);
            setIsLoading(false);
        });

    }, []);

    const clearRequest = useCallback(() => {
        setIsLoading(false);
        setError(null);
    }, []);
	
    return {
        sendRequest,
        clearRequest,
        isLoading,
        error
    };
};

export default useWFSGetFeature;