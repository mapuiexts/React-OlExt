import React, {useCallback, useEffect} from 'react';
import {Map} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import useGetBBoxGeomInteraction from '../../../../hooks/interactions/useGetBBoxGeomInteraction';
import useWFSGetFeature from '../../../../hooks/wfs/useWFSGetFeature';
import {bbox} from 'ol/format/filter';

/**
 * <p>
 *  Button to allow to retrieve the WFS features based on the BBOX (boundary box) 
 *  provided by the user.
 * </p>
 * 
 * <p>Remark: this component is present in the <i>WfsFeatureGrid</i> component.</p>
 *
  * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName WFS Search By BBOX Button
 */
const WfsSearchByBBoxButton = ({
    url, 
    map, 
    vectorLayer, 
    wfsOptions,
    fetchOptions, 
    msg, 
    ...otherProps
}) => {
    const {geometryName, srsName} = wfsOptions;
    const {start, clear, geometry, isRunning} = useGetBBoxGeomInteraction(map, msg);
    const wfsGetFeature = useWFSGetFeature();

    const onClickHandler = useCallback((event) => {
        start();
    }, [start]);

    useEffect(() => {
        if(geometry && !isRunning) {
            //clear layer
            vectorLayer.getSource().clear();
            //create filter
            const geom = geometry;
            const filter = bbox(
                geometryName, 
                geom.getExtent(),
                srsName
            );
            const wfsFilteredOptions = {...wfsOptions, filter};
            wfsGetFeature.sendRequest(url, map, vectorLayer, wfsFilteredOptions, fetchOptions);
            clear();
        }
    }, [geometry, isRunning, vectorLayer, geometryName, srsName, map, url, wfsGetFeature, wfsOptions, fetchOptions, clear]);

    return(
        <Button {...otherProps} onClick={onClickHandler} 
            disabled={isRunning}
            loading={wfsGetFeature.isLoading}
        >
            {otherProps.children}
        </Button>
    );
};

WfsSearchByBBoxButton.propTypes = {

    /**
     * The url used for the WFS request
     */
    url: PropTypes.string.isRequired,

    /**
     * The OpenLayers ol/Map where the WFS features will be rendered.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * The <i>ol/layer/Vector</i> layer from where the WFS features will
     * be stored. 
     */
    vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,

    /**
     * The WFS options for the WFS GetFeature request.
     * This object has the same format as used in the OpenLayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html">
     * ol/format/WFS.writeGetFeature</a> method.
     */
    wfsOptions: PropTypes.object.isRequired,

    /**
     * Additional options to be used for the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch API</a>.
     */
    fetchOptions: PropTypes.object,

    /**
     * Message to be shown requesting the user to provide the BBOX.
     * If not provided, a default message will be provided by the application.
     */
    msg: PropTypes.string,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default WfsSearchByBBoxButton;