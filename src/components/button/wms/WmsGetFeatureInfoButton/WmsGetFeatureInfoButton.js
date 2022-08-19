import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import BaseLayer from 'ol/layer/Base';
import {message, Button, Tooltip} from 'antd';
import useGetPointGeomInteraction from '../../../../hooks/interactions/useGetPointGeomInteraction';
import useWmsGetFeatureInfo from '../../../../hooks/wms/useWmsGetFeatureInfo';
import FeaturePropertiesWnd from '../../../window/feature/FeaturePropertiesWnd/FeaturePropertiesWnd';

/**
 * Button to retrieve the WMS properties from the feature(s) using the
 * WMS GetFeatureInfo request
 * @visibleName WMS GetFeatureInfo Button
 */
const WmsGetFeatureInfoButton = (props) => {
    const {
        map, 
        layers=map.getLayers().getArray(), 
        //icon=<InfoOutlined/>,
        //shape="circle", 
        fetchOpts, 
        msg, 
        wndStyle,
        children,
        tooltipProps = null,
    ...otherProps
    } = props;
    const interaction = useGetPointGeomInteraction(map, msg);
    const [sendRequest, clearRequest, errors, features] = useWmsGetFeatureInfo();
    if(errors) console.log('WMS GetFeatureInfo Errors: ', errors);

    const onClickHandler = useCallback(() => {
        interaction.start();
    }, [interaction]);

    const onClose = () => {
        clearRequest()
    };


    /**
     * UseEffect to retrieve the point from the user and send 
     * the WMS GetFeatureInfo request
     */
    useEffect(() => {
        if(interaction.geometry && !interaction.isRunning) {
            const geometry = interaction.geometry;
            interaction.clear();
            //send request
            sendRequest(map, layers, geometry, fetchOpts);
        }
    }, [interaction, fetchOpts, layers, map, sendRequest]);

    /**
     * UseEffect to retrieve the result from the WMS
     * GetFeatureInfo and show in the dialog properties
     */
    useEffect(() => {
        if(features) {
            if(features.length === 0) {
                message.info('No feature(s) selected!');
            }
        }

    }, [features]);

    return(
        <>
            <Tooltip title="Feature Info" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                <Button 
                    {...otherProps} 
                    onClick={onClickHandler} 
                    // disabled={interaction.isRunning}
                    loading={interaction.isRunning}
                >
                    {children}
                </Button>
            </Tooltip>
            {
                (features && features.length > 0) &&
                <FeaturePropertiesWnd 
                    title={children || 'Info'}  
                    features={features}
                    visible={features && features.length > 0}
                    onClose={onClose}
                    style={wndStyle}
                />
            }
        </>
    );
};

WmsGetFeatureInfoButton.propTypes = {
    /**
     * The OpenLayers ol/Map where the layers will be rendered.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * The layers to retrieve the feature information. If not provided,
     * all the layers in the map will be considered.
     */
    layers: PropTypes.arrayOf(PropTypes.instanceOf(BaseLayer)),

    /**
     * Additional options to be used for the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch API</a>.
     */
    fetchOptions: PropTypes.object,

    /**
     * Message to be shown requesting the user to select the feature
     */
    msg: PropTypes.string,

    /**
     * A CSS Style to render the window
     */
    wndStyle:PropTypes.object,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default WmsGetFeatureInfoButton;