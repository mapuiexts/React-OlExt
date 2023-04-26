import { useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import {Map} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import defined from '../../../../core/defined';
import useWfsGetFeatureByBoxSelectionInteraction from '../../../../hooks/interactions/wfs/useWfsGetFeatureByBoxSelectionInteraction';

/**
 * Button to retrieve a feature using WFS GetFeature service through a user 
 * selection on the screen
 * @visibleName WFS Search By Box Selection Button
 */
const WfsSearchByBoxSelectionButton = ({ 
    map,
    selectMsg = "Select feature",
    tolerance = 10,
    url,
    vectorLayer,
    wfsOptions,
    fetchOptions = null,
    onClick = null,
    onGetFeature = null,
    onStartSelection = null,
    onEndSelection = null,
    children,
    ...otherProps
}) => {

    const selectInteraction = useWfsGetFeatureByBoxSelectionInteraction(map, url, selectMsg, wfsOptions, tolerance, vectorLayer, fetchOptions);

    /**
     * Handler called once the user clicks in the 
     * button. At this point the system
     * will request the user the position to select the feature
     */
    const onClickHandler = useCallback((event) => {
        onClick && onClick();
        onStartSelection && onStartSelection();
        selectInteraction.start();
    }, [selectInteraction, onClick, onStartSelection]);

    /**
     * Method executed once the feature(s) is retrieved from 
     * the user selection. The retrieved feature(s) are passed
     * from parameter in the OnGetFeature callback.
     */
    useEffect(() => {
        if(defined(selectInteraction.features)) {
            if(selectInteraction.features.length === 0) {
                message.info('feature not found');
            }
            onGetFeature && onGetFeature(selectInteraction.features);
            onEndSelection && onEndSelection();
            selectInteraction.clear();
           
        }
    }, [onEndSelection, onGetFeature, selectInteraction]);
        
    return(
        <Button {...otherProps} onClick={onClickHandler} 
            disabled={selectInteraction.isRunning}
            loading={selectInteraction.isRunning}
        >
            {children}
        </Button>
    );
};

WfsSearchByBoxSelectionButton.propTypes = {
    /**
     * The OpenLayers ol/Map where the retrieved WFS features will be rendered.
     */
     map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Message to be shown requesting the user to select the feature.
     * If not provided, a default message will be provided by the application.
     */
    selectMsg: PropTypes.string,

    /**
     * the box selection size (radius) in pixel
     */
    tolerance: PropTypes.number,

    /**
     * The url used for the WFS request
     */
     url: PropTypes.string.isRequired,

     /**
     * The <i>OpenLayers vector layer</i> where the retrieved WFS features will
     * be stored. 
     */
    vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,

    /**
     * The WFS options for the WFS GetFeature request.
     * This object has the same format as used in the OpenLayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html">
     * WFS writeGetFeature</a> method.
     */
     wfsOptions: PropTypes.object.isRequired,

    /**
     * Additional options to be used for the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch API</a>.
     */
    fetchOptions: PropTypes.object,

    /**
     * Event handler called once the button is clicked
     * Can be used, for instance, to hide the dialog once the button
     * present in the dialog is clicked.
     */
    onClick: PropTypes.func,

    /**
     * Event handler called once the feature(s) is retrieved 
     * from the wfs call. This function has as parameter 
     * a collection of the retrieved features
     */
    onGetFeature: PropTypes.func,

    /**
     * Event handler called once the user interaction starts
     * requesting the user selection. 
     * Can be used, for instance, to hide the dialog once the button
     * present in the dialog is clicked.
     */
    onStartSelection: PropTypes.func,

    /**
     * Event handler called once the user interaction ends.
     * Can be used, for instance, to show again the dialog box 
     * after the user has selected the feature.
     */
    onEndSelection: PropTypes.func
};

export default WfsSearchByBoxSelectionButton;