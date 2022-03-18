import React, {useCallback} from 'react';
import {Map} from 'ol';
import Base from 'ol/layer/Base';
import PropTypes from 'prop-types';
import { Button } from 'antd';

/**
 * <p>Button to remove a layer from the map.</p>
 * <p>Remark: this component also is present in the <i>Layer Tree</i> component.</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName Remove Layer Button 
 */
const RemoveLayerButton = ({
    map,
    layer,
    children,
    ...otherProps
}) => {
    const onClickHandler = useCallback((event) => {
        if(map && layer) {
           if (layer.getSource && layer.getSource().clear) {
                layer.getSource().clear(true);
           }
           map.removeLayer(layer);
        }
    }, [layer, map]);

    return(
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );
};

RemoveLayerButton.propTypes = {
    /**
     * The OpenLayers ol/Map from where the layer will be removed.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Layer to be removed.
     */
    layer: PropTypes.instanceOf(Base),

    /**
     * The child node for the Button
     */
    children: PropTypes.node
};

export default RemoveLayerButton;