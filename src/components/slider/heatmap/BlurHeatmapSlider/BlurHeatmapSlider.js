import React, {useState, useEffect} from 'react';
import {Slider} from 'antd';
import PropTypes from 'prop-types';
import {Heatmap} from 'ol/layer';
import usePrevious from '../../../../hooks/common/usePrevious';

/**
 * Slider component to change the Blur for the Heatmap layer.
 * Check <a href="https://ant.design/components/slider/">
 * Antd Slider</a> component for additional properties.
 * @visibleName BlurHeatmap Slider
 *  
 */
const BlurHeatmapSlider = ({
    heatmapLayer,
    min = 0,
    max= 100,
    step = 1,
    vertical = false,
    value,
    ...otherProps
}) => {
    
    const [currentValue, setCurrentValue] = useState(heatmapLayer.getBlur());
    const [internalLayer, ] = useState(heatmapLayer);
    
    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }


    /**
     * Handler to change the blur for heatmap layer when the slider value 
     * is changed
     */
    const onChangeHandler = (value) => {
        heatmapLayer.setBlur(value);
    };

    /**
     * 
     * Handler to change the value in the Slider 
     * if the blur for the heatmap layer changes.
     */
    const onLayerChangeBlurHandler = (evt) => {
        setCurrentValue(evt.target.getBlur());
    }

     /**
     * Register/Unregister the handler to be called
     * if the blur of the heatmap layer is changed
     */
      useEffect(() => {
        internalLayer.on('change:blur', onLayerChangeBlurHandler);
        //clean-up:
        return () => internalLayer.un('change:blur', onLayerChangeBlurHandler);
    }, [internalLayer]);

    return(
        <Slider
            {...otherProps}
            defaultValue={heatmapLayer.getBlur()}
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

BlurHeatmapSlider.propTypes = {

    /**
     * The OpenLayers heatmap layer ol/layer/Heatmap with blur to be changed.
     */
    heatmapLayer: PropTypes.instanceOf(Heatmap),

    /**
     * The maximum blur value the slider can slide to
     */
    max: PropTypes.number,

    /**
     * The minimum blur value the slider can slide to
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
      * the current blur value
      * @ignore
      */
     value: PropTypes.number,

};


export default BlurHeatmapSlider;