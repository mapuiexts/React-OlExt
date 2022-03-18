import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { Button } from 'antd';
import {zoomToLayer as zoomToLyr} from '../../../../util/map';

/**
 * <p>
 *  Button to Zoom to all the features in a <i>ol/layer/Vector</i> 
 *  vector layer.
 * </p>
 * <p>Remark:This component is present in the <i>WfsFeatureGrid</i> component.</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * @visibleName Zoom to All Features 
 */
const ZoomToAllFeaturesButton = ({
    map,
    vectorLayer,
    children,
    ...otherProps
}) => {
    
    const onClickHandler = useCallback((event) => {
        if(vectorLayer && map) {
            zoomToLyr(map, vectorLayer);
        }
    }, [vectorLayer, map]);

    return(
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );
};

ZoomToAllFeaturesButton.propTypes = {

    /**
     * The OpenLayers ol/Map to zoom
     */
    map: PropTypes.instanceOf(Map).isRequired,
    /**
     * The <i>ol/layer/Vector</i> layer from where all the features will
     * be zoomed. 
     */
    vectorlayer: PropTypes.instanceOf(VectorLayer),

    /**
     * The child node for the button
     */
    children: PropTypes.node
}

export default ZoomToAllFeaturesButton;
