import {useCallback, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {AutoComplete} from 'antd';
import {Map} from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import useNominatimGeocoder from '../../../../hooks/geocoder/useNominatimGeocoder';
import usePrevious from '../../../../hooks/common/usePrevious';
import {ZoomToFeatures} from '../../../../util/map';

/**
 * Component to allow a selection of a place through a 
 * list of places retrieved dynamically through the 
 * <a href="https://nominatim.org/release-docs/latest/api/Search/">
 *  Nominatim Geocoder
 * </a>.
 * 
 * Check <a href="https://ant.design/components/auto-complete/">
 * Antd AutoComplete</a> component for additional properties.
 * 
 * @visibleName Nominatim Geocoder AutoComplete 
 */
const NominatimGeocoderAutoComplete = ({
    map,
    placeholder = "Select a place",
    value,
    fetchOpts,
    delay = 1000,
    allowClear = true,
    onSelect,
    onSearch,
    onChange,
    onSelectFeature,
    showOnMap = true,
    defaultIcon= "https://www.google.com/mapfiles/marker.png",
    ...otherProps
}) => {

    const [currentValue, setCurrentValue] = useState(null);
    const [, setCurrentPlace] = useState(null);
    const [sendRequest,  , places, timeoutId, ] = useNominatimGeocoder();
    const [internalVectorLayer, setInternalVectorLayer] = useState(null);

    const previousValue = usePrevious(value);
    if(value !== previousValue && value !== currentValue) {
        setCurrentValue(value);
    }

    const onInternalSelect = useCallback((value, option) => {
        //setCurrentValue(value);
        setCurrentPlace(option);
        setCurrentValue(value);
        //parse feature
        const geoJsonParser = new GeoJSON();
        const feature = geoJsonParser.readFeature(option.feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: map.getView().getProjection()
        });
        //draw feature on the map
        if(map && showOnMap) {
            
            if(internalVectorLayer) {
                internalVectorLayer.getSource().clear();
                internalVectorLayer.getSource().addFeature(feature);
                ZoomToFeatures(map, [feature]);
            }
        }
        onSelect && onSelect(value, option);
        //call event handler
        onSelectFeature && onSelectFeature(value, feature, option.feature);
    }, [onSelect, showOnMap, map, onSelectFeature, internalVectorLayer]);

    const onInternalSearch = useCallback((value) => {
        if(value && value.length > 2) {
            clearTimeout(timeoutId);
            sendRequest(value, delay, fetchOpts);
        }
        onSearch && onSearch(value);
    },[onSearch, sendRequest, timeoutId, delay, fetchOpts]);

    const onInternalChange = useCallback((value) => {
        setCurrentValue(value);
        if(!value) {
            //clear feature on the map
            if(internalVectorLayer) {
                internalVectorLayer.getSource().clear();
            }
        }
        onChange && onChange(value);
    }, [onChange, internalVectorLayer]);

    useEffect(() => {
        let newVectorLayer = null;
        if(map && showOnMap && !internalVectorLayer) {
            newVectorLayer = new VectorLayer({
                name: 'Nominatim Geocoding',
                source: new VectorSource(),
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: defaultIcon
                    })
                })
            });
            setInternalVectorLayer(newVectorLayer);
            map.addLayer(newVectorLayer);
        }
        return () => {
            internalVectorLayer && map.removeLayer(internalVectorLayer);
        }
    }, [map, showOnMap, internalVectorLayer, defaultIcon]);

    return(
        <AutoComplete
            value={currentValue}
            options={places}
            allowClear={allowClear}
            onSelect={onInternalSelect}
            onChange={onInternalChange}
            onSearch={onInternalSearch}
            placeholder={placeholder}
            {...otherProps}
        />
    );

};

NominatimGeocoderAutoComplete.propTypes = {

    /**
     * The OpenLayers ol/Map where the place will be rendered.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The placeholder for the autocomplet component.
     */
    placeholder: PropTypes.string,

    /**
     * Show the clear button to clear the input.
     * If the place is shown in the map, it will
     * be removed after the user clears the input.
     */
    allowClear: PropTypes.bool,

    /**
     * Called when a option is selected. param is option's value and option instance
     * @ignore
     */
    onSelect:PropTypes.func,

    /**
     * Called when a option is selected. param is projection option's value, 
     * the openlayers ol/Feature representing 
     * the place and the <i>javascript object</i> place retrieved from 
     * the geocoder.
     */
    onSelectFeature: PropTypes.func,
     

    /**
     * Called when select an option or input value change, 
     * or value of input is changed. The param is the input value.
     * @ignore
     */
    onChange: PropTypes.func,

    /**
     * Called when searching items
     * @ignore
     */
    onSearch: PropTypes.func,

    /**
     * Selected place
     * @ignore
     */
    value: PropTypes.string,

    /**
     * If true, the place will be shown
     * in the map.
     */
    showOnMap: PropTypes.bool,

    /**
     * The icon to be shown in the map representing
     * the selected place.
     */
    defaultIcon: PropTypes.string,

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
    fetchOpts: PropTypes.object
};

export default NominatimGeocoderAutoComplete;