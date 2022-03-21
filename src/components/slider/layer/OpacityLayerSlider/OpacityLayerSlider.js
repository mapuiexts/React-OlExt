import React, {useState, useEffect} from 'react';
import {Slider} from 'antd';
import PropTypes from 'prop-types';
import BaseLayer from 'ol/layer/Base';
import usePrevious from '../../../../hooks/common/usePrevious';

/**
 * Slider component to change the layer opacity.
 * Check <a href="https://ant.design/components/slider/">
 * Antd Slider</a> component for additional properties.
 * @visibleName OpacityLayer Slider
 *  
 */
const OpacityLayerSlider = ({
    layer,
    step = 0.1,
    vertical = false,
    value,
    ...otherProps
}) => {
    
    const [currentValue, setCurrentValue] = useState(layer.getOpacity());
    const [internalLayer, ] = useState(layer);
    
    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }


    /**
     * Handler to change the layer opacity when the slider value 
     * is changed
     */
    const onChangeHandler = (value) => {
        layer.setOpacity(value);
    };

    /**
     * 
     * Handler to change the value in the Slider 
     * if the layer opacity changes.
     */
    const onLayerChangeOpacityHandler = (evt) => {
        setCurrentValue(evt.target.getOpacity());
    }

     /**
     * Register collection event handlers for the group layer and 
     * its child group layers 
     */
      useEffect(() => {
        internalLayer.on('change:opacity', onLayerChangeOpacityHandler);
        //clean-up:
        return () => internalLayer.un('change:opacity', onLayerChangeOpacityHandler);
    }, [internalLayer]);

    return(
        <Slider
            {...otherProps}
            defaultValue={layer.getOpacity()}
            max={1}
            min={0}
            step={step}
            range={false}
            disabled={false}
            onChange={onChangeHandler}
            value={currentValue}
        />
    );
};

OpacityLayerSlider.propTypes = {

    /**
     * The OpenLayers layer with opacity to be changed.
     */
    layer: PropTypes.instanceOf(BaseLayer),

    /**
     * The granularity the slider can step through values. 
     * Must be greater than 0 and between 0 and 1.
     */
     step: PropTypes.number,

     /**
      * If true, the slider will be vertical
      */
     vertical: PropTypes.bool,

     /**
      * the current opacity value
      * @ignore
      */
     value: PropTypes.number,

};


export default OpacityLayerSlider;