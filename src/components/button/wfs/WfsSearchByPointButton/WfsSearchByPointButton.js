import React, {useCallback, useEffect} from 'react';
import {Map} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
//import useGetPointGeomInteraction from '../../../../hooks/interactions/useGetPointGeomInteraction';
//import useWFSGetFeature from '../../../../hooks/wfs/useWFSGetFeature';
import useWfsGetFeatureByPointInteraction from '../../../../hooks/interactions/wfs/useWfsGetFeatureByPointInteraction';
//import {intersects} from 'ol/format/filter';
import defined from '../../../../core/defined';


/**
 * <p>
 *  Button to allow to retrieve the WFS features based on the Point  
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
 * @visibleName WFS Search By Point Button
 */

 const WfsSearchByPointButton = ({
    url, 
    map, 
    vectorLayer, 
    wfsOptions,
    fetchOptions,
    msg,
    onFeatures, 
    ...otherProps
}) => {
    //const {geometryName, /*srsName*/} = wfsOptions;
    //const {start, clear, geometry, isRunning} = useGetPointGeomInteraction(map, msg);
    //const wfsGetFeature = useWFSGetFeature();

    const interaction = useWfsGetFeatureByPointInteraction(map, url, msg, wfsOptions, vectorLayer, fetchOptions);


    const onClickHandler = useCallback((event) => {
        interaction.start();
    }, [interaction]);


    useEffect(() => {
        if(defined(interaction.features)) {
            if(interaction.features.length === 0) {
                message.info('Features not found!!');
            }
            console.log(interaction.features);
            defined(onFeatures) && onFeatures(interaction.features);
            interaction.clear();
        }
    },  [interaction, onFeatures]);

    useEffect(() => {
        if(defined(interaction.error)) {
            message.info(interaction.error);
            console.log(message.info(interaction.error));
            interaction.clear();
        }
    }, [interaction]);

    return(
        <Button {...otherProps} onClick={onClickHandler} 
            //disabled={isRunning}
            loading={interaction.isRunning}
        >
            {otherProps.children}
        </Button>
    );
};

// const WfsSearchByPointButton = ({
//     url, 
//     map, 
//     vectorLayer, 
//     wfsOptions,
//     fetchOptions,
//     msg, 
//     ...otherProps
// }) => {
//     const {geometryName, /*srsName*/} = wfsOptions;
//     const {start, clear, geometry, isRunning} = useGetPointGeomInteraction(map, msg);
//     const wfsGetFeature = useWFSGetFeature();

//     //retrieve the srs from map
//     const proj = map.getView().getProjection();
//     let srsName =proj.getCode();
//     const axisOrientation = proj.getAxisOrientation();
//     if(axisOrientation === 'neu') srsName = 'urn:x-ogc:def:crs:' + srsName;
//     wfsOptions.srsName = srsName;

//     const onClickHandler = useCallback((event) => {
//         start();
//     }, [start]);

//     useEffect(() => {
//         if(geometry && !isRunning) {
//             //clear layer
//             vectorLayer.getSource().clear();
//             //create filter
//             const geom = geometry;
//             const filter = intersects(
//                 geometryName, 
//                 geom,
//                 srsName
//             );
//             const wfsFilteredOptions = {...wfsOptions, filter};
//             wfsGetFeature.sendRequest(url, map, vectorLayer, wfsFilteredOptions, fetchOptions);
//             clear();
//         }
//     }, [geometry, isRunning, vectorLayer, geometryName, srsName, map, url, wfsGetFeature, wfsOptions, fetchOptions, clear]);

//     return(
//         <Button {...otherProps} onClick={onClickHandler} 
//             disabled={isRunning}
//             loading={wfsGetFeature.isLoading}
//         >
//             {otherProps.children}
//         </Button>
//     );
// };

WfsSearchByPointButton.propTypes = {

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
    vectorLayer: PropTypes.instanceOf(VectorLayer),

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
     * Message to be shown requesting the user to provide the point.
     * If not provided, a default message will be provided by the application.
     */
    msg: PropTypes.string,

    /**
     * Callback Handler receiveing as parameter an
     * array of retrieved features
     */
    onFeatures: PropTypes.func,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default WfsSearchByPointButton;