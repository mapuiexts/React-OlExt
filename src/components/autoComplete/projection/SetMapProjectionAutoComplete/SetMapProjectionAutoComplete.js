import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import View from 'ol/View';
import {transform} from 'ol/proj';
import useGetProjection from '../../../../hooks/projection/useGetProjection';
import usePrevious from '../../../../hooks/common/usePrevious';
import GetProjectionAutoComplete from '../GetProjectionAutoComplete/GetProjectionAutoComplete';

/**
 * Component to set the map projection through a selection 
 * of a projection in a autocomplete component. A list of 
 * available projections are retrieved dynamically through the 
 * autocomplete.
 * 
 * Check <a href="https://ant.design/components/auto-complete/">
 * Antd AutoComplete</a> component for additional properties.
 * 
 * @visibleName Set Map Projection AutoComplete 
 */
const SetMapProjectionAutoComplete = ({
    map,
    placeholder = "Please, select a projection",
    allowClear = true,
    onSelectProjection = null,
    onChange = null,
    onClearProjection = null,
    value,
    ...otherProps
}) => {

    const [currentValue, setCurrentValue] = useState(value);
    const [viewWasChanged, setViewWasChanged] = useState(false);
    const [viewWasChangedInternally, setViewWasChangedInternally] = useState(false);
    const [sendRequest, clearRequest , projections, ] = useGetProjection();

    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }

     /**
     * Event Handler to handle 'change:view' event
     * 
     */
    const onChangeView = useCallback((evt) => {
        setViewWasChanged(true);
    }, []);

    const onInternalSelectProjection = useCallback((value, projectionObj, projection) => {
        //set map projection
        const mapProjectionCode = map.getView().getProjection().getCode();
        if(projection.getCode() !== mapProjectionCode) {
            setCurrentValue(value);
            setViewWasChangedInternally(true);
            const zoom = map.getView().getZoom();
            const center = map.getView().getCenter();
            const newCenter = transform(center, mapProjectionCode, projection.getCode());
            map.setView(
                new View({
                    projection: projection.getCode(),
                    center: newCenter,
                    zoom: zoom,
                })
            );
        }

        //call client handler
        onSelectProjection && onSelectProjection(value, projectionObj, projection);
    }, [onSelectProjection, map]);

    const onInternalChange = useCallback((value) => {
        setCurrentValue(value);
        onChange && onChange(value);
        onClearProjection && (value === '') && onClearProjection();
    }, [onChange, onClearProjection]);

    /**
     * Register 'change:view' for the group layer and all its
     * childrens
     */
    useEffect(() => {
        map.on('change:view', onChangeView);
        //clean-up:
        return () => map.un('change:view', onChangeView);;
    }, [map, onChangeView]);

    /**
     * Effect to send request to get projection if the map view was changed
     */
    useEffect(() => {
        if(viewWasChanged && !viewWasChangedInternally && !projections) {
                sendRequest(map.getView().getProjection().getCode().toUpperCase().replace('EPSG:', ''));
        }
        else {
            setViewWasChanged(false);
            setViewWasChangedInternally(false);
        }
    }, [map, viewWasChanged, viewWasChangedInternally, projections, sendRequest]);

    /**
     * Effect to retrieve the response from the previous request to get the 
     * projection once the map view projection is changed.
     */
    useEffect(() => {
        if(viewWasChanged && !viewWasChangedInternally && projections) {
            if(projections.length > 0) {
                setCurrentValue(projections[0].value);
                setViewWasChanged(false);
                setViewWasChangedInternally(false);
                const projection = map.getView().getProjection()
                //call event handler
                onSelectProjection && onSelectProjection(projections[0].value, projections[0].projection, projection);
                //clear request
                clearRequest();
            }
        }
    }, [map, currentValue, projections, sendRequest, clearRequest, 
        viewWasChanged, viewWasChangedInternally, onSelectProjection]);

    return (
        <GetProjectionAutoComplete 
            onSelectProjection  = {onInternalSelectProjection}
            onChange = {onInternalChange}
            value= {currentValue}
            defaultValue={map.getView().getProjection().getCode().toUpperCase().replace('EPSG:', '')}
            registerSelectedProjection={true}
            {...otherProps}
        />
    );
};

SetMapProjectionAutoComplete.propTypes = {

    /**
     * ol/Map on which the selected projection will be set.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * The placeholder for the autocomplet component.
     */
    placeholder: PropTypes.string,

    /**
     * Selected projection
     */
    value: PropTypes.string,

    /**
     * Show the clear button to clear the input
     */
    allowClear: PropTypes.bool,
    
    /**
     * Called when a option is selected. param is projection option's value, 
     * the <i>object</i> projection and the openlayers ol/Projection
     */
    onSelectProjection: PropTypes.func,

    /**
     * Called when the input value is cleared or it is an empty string.
     */
    onClearProjection: PropTypes.func,

    /**
     * Called when select an option or input value change, 
     * or value of input is changed. The param is the input value.
     * @ignore
     */
    onChange: PropTypes.func,

};

export default SetMapProjectionAutoComplete;