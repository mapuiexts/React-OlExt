import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {transform} from 'ol/proj';
import Projection from 'ol/proj/Projection';
import View from 'ol/View';
import {Select} from 'antd';
import usePrevious from '../../../../hooks/common/usePrevious';


/**
 * Select component to set the map projection (CRS) once the user selects
 * the projection.
 * 
 * @visibleName MapProjection Select 
 */
const MapProjectionSelect = ({
    map,
    projs=[map.getView().getProjection()],
    value,
    ...otherProps
}) => {

    const [currentValue, setCurrentValue] = useState(map.getView().getProjection().getCode());

    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }

    /**
     * Handler to change assign a new view to the map if the projection
     * is changed in the Select component
     * @param {String} value The selected projection code
     */
    const onProjChangeHandler = (value) => {
        const mapProjectionCode = map.getView().getProjection().getCode();
        
        if(value !== mapProjectionCode) {
            const zoom = map.getView().getZoom();
            const center = map.getView().getCenter();
            const newCenter = transform(center, mapProjectionCode, value);
            map.setView(
                new View({
                    projection: value,
                    center: newCenter,
                    zoom: zoom,
                })
            );
            setCurrentValue(value);
        }
    };

    /**
     * Handler to change the projection in the Select component
     * if a new view is assigned to the map with a different projection
     */
    const onChangeViewHandler = useCallback((evt) => {
        setCurrentValue(evt.target.getView().getProjection().getCode());
    }, []);

    /**
     * Register 'change:view' for the map
     * fired if a new view is assigned to the map
     */
     useEffect(() => {
        map.on('change:view', onChangeViewHandler);
        //clean-up:
        return () => map.un('change:view', onChangeViewHandler);;
    }, [map, onChangeViewHandler]);


    return(
        <Select
            {...otherProps}
            defaultValue={map.getView().getProjection().getCode()}
            onChange={onProjChangeHandler}
            value={currentValue}
        >
            {projs.map((proj) => {
                return (
                    <Select.Option key={proj.getCode()} value={proj.getCode()}>
                        {proj.getCode()}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

MapProjectionSelect.propTypes = {
    /**
     * The OpenLayers ol/Map on which the selected projection
     * will be set.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Array of ol/proj/Projection to be show in the 
     * Select component
     */
     projs: PropTypes.arrayOf(PropTypes.instanceOf(Projection)).isRequired

}

export default MapProjectionSelect;