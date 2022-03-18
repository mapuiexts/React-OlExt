import {useCallback, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {AutoComplete} from 'antd';
import {get as getProjection} from 'ol/proj/projections';
import {registerProjection} from '../../../../util/map';
import useGetProjection from '../../../../hooks/projection/useGetProjection';
import usePrevious from '../../../../hooks/common/usePrevious';


/**
 * Component to allow a selection of a projection through a 
 * list of projections retrieved dynamically through the 
 * autocomplete.
 * 
 * Check <a href="https://ant.design/components/auto-complete/">
 * Antd AutoComplete</a> component for additional properties.
 * 
 * @visibleName Get Projection AutoComplete 
 */
const GetProjectionAutoComplete = ({
    placeholder = "Select a projection",
    allowClear = true,
    onSelectProjection = null,
    onSelect = null,
    onChange = null,
    onClearProjection = null,
    onSearch = null,
    registerSelectedProjection = true,
    value,
    delay = 1000,
    fetchOpts,
    defaultValue,
    ...otherProps
}) => {

    const [currentValue, setCurrentValue] = useState(value);
    const [, setCurrentProjection] = useState(null);
    const [sendRequest, clearRequest , projections, timeoutId, ] = useGetProjection();
    const [defaultValueWasUsed, setDefaultValueWasUsed] = useState(false);

    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }

    const onInternalSelect = useCallback((value, option) => {
        setCurrentValue(value);
        setCurrentProjection(option);
        onSelect && onSelect(value, option);
        //register projection if not registered
        const projectionCode = `EPSG:${option.projection.code}`;
        let projection =  getProjection(projectionCode);
        if(registerSelectedProjection && !projection) {
            projection = registerProjection(projectionCode, option.projection.proj4);
        }
        //call event handler
        onSelectProjection && onSelectProjection(value, option.projection, projection);
    }, [onSelectProjection, onSelect, registerSelectedProjection]);

    const onInternalChange = useCallback((value) => {
        setCurrentValue(value);
        onChange && onChange(value);
        onClearProjection && (value === '') && onClearProjection();
       
    }, [onChange, onClearProjection]);

    const onInternalSearch = useCallback((value) => {
        if(value && value.length > 0) {
            clearTimeout(timeoutId);
            sendRequest(value, delay, fetchOpts);
        }
        onSearch && onSearch(value);
    },[onSearch, sendRequest, delay, timeoutId, fetchOpts]);

    /**
     * Effect to send the request to retrieve the projections based on the default value
     */
    useEffect(() => {
        if(!currentValue && !projections && defaultValue) {
            if(defaultValue.trim().length > 0) {
                
                sendRequest(defaultValue, 0, fetchOpts);
            }
        }
        return () => {
            //clearTimeout(timeoutId);
        }
    }, [currentValue, defaultValue, projections, sendRequest, fetchOpts]);


    /**
     * Effect to retrieve the projections based on the default value 
     * from the previous request
     * 
     */
    
    useEffect(() => {
        if(!currentValue && projections && defaultValue && !defaultValueWasUsed) {
            if(projections.length > 0) {
                setCurrentValue(projections[0].value);
                setDefaultValueWasUsed(true);
                //register projection if not registered
                const projectionCode = `EPSG:${projections[0].projection.code}`;
                let projection =  getProjection(projectionCode);
                if(registerSelectedProjection && !projection) {
                    projection = registerProjection(projectionCode, projections[0].projection.proj4);
                }
                //call event handler
                onSelectProjection && onSelectProjection(projections[0].value, projections[0].projection, projection);
                //clear request
                clearRequest();
            }
        }
    }, [currentValue, defaultValue, projections, clearRequest,
        onSelectProjection, defaultValueWasUsed, registerSelectedProjection]);

    return(
        <AutoComplete
            value={currentValue}
            options={projections}
            allowClear={allowClear}
            onSelect={onInternalSelect}
            onChange={onInternalChange}
            onSearch={onInternalSearch}
            placeholder={placeholder}
            {...otherProps}
        />
    );
};

GetProjectionAutoComplete.propTypes = {

    /**
     * The placeholder for the autocomplet component.
     */
    placeholder: PropTypes.string,

    /**
     * Show the clear button to clear the input
     */
    allowClear: PropTypes.bool,

    /**
     * Called when a option is selected. param is option's value and option instance
     * @ignore
     */
    onSelect:PropTypes.func,

    /**
     * Called when a option is selected. param is projection option's value, 
     * the <i>object</i> projection and, if the projection is registered,
     * the openlayers ol/Projection
     */
    onSelectProjection: PropTypes.func,
     

    /**
     * Called when select an option or input value change, 
     * or value of input is changed. The param is the input value.
     * @ignore
     */
    onChange: PropTypes.func,

    /**
     * Called when the input value is cleared or it is an empty string.
     */
     onClearProjection: PropTypes.func,

    /**
     * Called when searching items
     * @ignore
     */
    onSearch: PropTypes.func,

    /**
     * Selected projection
     */
    value: PropTypes.string,

    /**
     * time delay (in milliseconds) to send the autocomplete request,
     * to avoid that a request will be sent everytime
     * the user type a letter.
     */
    delay: PropTypes.number,

    /**
     * Additional options to be used for the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch API</a>.
     */
    fetchOpts: PropTypes.object,

    /**
     * Initial selected projection
     */
    defaultValue: PropTypes.string,

    /**
     * If the selected projection is not defined and 
     * this parameter is true, the selected projection will
     * be registered
     */
    registerSelectedProjection: PropTypes.bool
    
};

export default GetProjectionAutoComplete;