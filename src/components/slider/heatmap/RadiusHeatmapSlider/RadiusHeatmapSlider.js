import React, {useState, useEffect} from 'react';
import {Slider} from 'antd';
import PropTypes from 'prop-types';
import {Heatmap} from 'ol/layer';
import usePrevious from '../../../../hooks/common/usePrevious';

/**
 * Slider component to change the Radius for the Heatmap layer.
 * Check <a href="https://ant.design/components/slider/">
 * Antd Slider</a> component for additional properties.
 * @visibleName RadiusHeatmap Slider
 *  
 */
const RadiusHeatmapSlider = ({
    heatmapLayer,
    min = 0,
    max= 100,
    step = 1,
    vertical = false,
    value,
    ...otherProps
}) => {
    
    const [currentValue, setCurrentValue] = useState(heatmapLayer.getRadius());
    const [internalLayer, ] = useState(heatmapLayer);
    
    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }


    /**
     * Handler to change the radius for heatmap layer when the slider value 
     * is changed
     */
    const onChangeHandler = (value) => {
        heatmapLayer.setRadius(value);
    };

    /**
     * 
     * Handler to change the value in the Slider 
     * if the radius for the heatmap layer changes.
     */
    const onLayerChangeRadiusHandler = (evt) => {
        setCurrentValue(evt.target.getRadius());
    }

     /**
     * Register/Unregister the handler to be called
     * if the radius of the heatmap layer is changed
     */
      useEffect(() => {
        internalLayer.on('change:radius', onLayerChangeRadiusHandler);
        //clean-up:
        return () => internalLayer.un('change:radius', onLayerChangeRadiusHandler);
    }, [internalLayer]);

    return(
        <Slider
            {...otherProps}
            defaultValue={heatmapLayer.getRadius()}
            max={max}
            min={min}
            step={step}
            range={false}
            vertical={vertical}
            onChange={onChangeHandler}
            value={currentValue}
        />
    );
};

RadiusHeatmapSlider.propTypes = {

    /**
     * The OpenLayers heatmap layer with radius to be changed.
     */
    heatmapLayer: PropTypes.instanceOf(Heatmap),

    /**
     * The maximum value the slider can slide to
     */
    max: PropTypes.number,

    /**
     * The minimum value the slider can slide to
     */
    min: PropTypes.number,

    /**
     * The granularity the slider can step through values. 
     * Must be greater than 0.
     */
    step: PropTypes.number,

    /**
     * If true, the slider will be vertical
     */
    vertical: PropTypes.bool,

     /**
      * the current radius value
      * @ignore
      */
     value: PropTypes.number,

};


export default RadiusHeatmapSlider;