import {useState, useCallback} from 'react';
import {message} from 'antd';
import {parseFeatureInfo} from '../../util/featureinfo';

import {getLeafVisibleLayers} from '../../util/map';

const useWmsGetFeatureInfo = () => {
    const [errors, setErrors] = useState(null);
    const [features, setFeatures] = useState(null);

    const clearRequest = useCallback(() => {
        setErrors(null);
        setFeatures(null);
    }, []);

    const sendRequest = useCallback((
        map, 
        layers, 
        position, 
        fetchOpts = {
            method: 'GET'
        }
        ) => {
        //retrieve coordinate from the point geometry
        const coordinate = position.getCoordinates();
        //retrieve all the active leaf leayers
        let leafLayers = getLeafVisibleLayers(layers);
        
        if(leafLayers.length === 0) {
            message.info("Please, activate the layers to retrieve the features!!!");
            return;
        }
        //retrieve map view and its resolution
        const view = map.getView();
        const viewResolution = view.getResolution();
        const proj = view.getProjection();
        const newStates = [];
        leafLayers.forEach((lyr, index) => {
            newStates.push(true);
        });
        
        fetchOpts = {
            ...fetchOpts, 
            method: 'GET',
        };
        leafLayers.forEach((lyr, index) => {
            const wmsSource = lyr.getSource();
            if(!wmsSource.getFeatureInfoUrl) return;
            let info_format =  lyr.getSource().getParams().INFO_FORMAT;
            console.log('info_format:', info_format);
            if(!info_format) info_format = 'application/json';
            const url = wmsSource.getFeatureInfoUrl(coordinate, 
                viewResolution, proj, 
                {'INFO_FORMAT': info_format}
            );
            console.log('WMS GetFeatureInfo Request:', url);
            fetch(url, fetchOpts)
            .then(response => {
                if(!response.ok) {
                   throw new Error(response);
                }
                if(info_format === 'application/json')
                    return response.json();
                else
                    return response.text();
            })
            .then(responseData => {
                console.log('WFS GetFeature Response:', responseData);
                
                const newFeatures = parseFeatureInfo(responseData, info_format);
                setFeatures((prevFeatures) => {
                    if(prevFeatures && newFeatures) {
                        return [...prevFeatures, ...newFeatures];
                    }
                    return newFeatures;
                });
            })
            .catch(error => {
                setErrors((prevErrors) => {
                    if(prevErrors) {
                        return [...prevErrors, error];
                    }
                    return [error];
                });
                message.info(error.message);
            });
        });

    }, []);

    return [sendRequest, clearRequest, errors, features];
};

export default useWmsGetFeatureInfo;