
import {useCallback} from 'react';
import OlLayerGroup from 'ol/layer/Group';
import NewLayerForm from '../NewLayerForm/NewLayerForm';

const defaultLayerOpts = {
    opacity: 1,
    maxResolution: Infinity,
    maxZoom: Infinity,
    minResolution: 0,
    minZoom: -Infinity,
    visible: true,
    zIndex: 0,
    name: 'unnamed group layer',
};

const NewGroupLayerForm = ({
    map,
    parentLayerGroup = undefined,
    layerOpts = defaultLayerOpts, 
    onFinish = undefined
}) => {

    const onInternalFinish = useCallback((values) => {
        //create new Group Layer with values from Form
        const layer = new OlLayerGroup(values);
        //add layer to the map
        if(parentLayerGroup)
            parentLayerGroup.getLayers().push(layer);
        else
            map.addLayer(layer);
        //execute onFinish
        onFinish && onFinish();

    },[map, parentLayerGroup, onFinish]);

    return(
        <NewLayerForm 
            layerOpts={layerOpts} 
            onFinish={onInternalFinish}
        />
    );
};

export default NewGroupLayerForm;