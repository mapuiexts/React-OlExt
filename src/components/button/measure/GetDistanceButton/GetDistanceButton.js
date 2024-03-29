import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { Button, Tooltip } from 'antd';
import VectorSource from 'ol/source/Vector';
import defined from '../../../../core/defined';
import useGetDistanceInteraction from '../../../../hooks/interactions/measure/useGetDistanceInteraction';


/**
 * Button to measure the distance in meters 
 */
const GetDistanceButton = ({
    map,
    vectorSource,
    startMsg,
    continueMsg,
    drawOptions,
    snapOptions,
    onDistance,
    tooltipProps = null,
    showTooltip = true,
    children,
    ...otherProps
}) => {

    const interaction = useGetDistanceInteraction(map, vectorSource, startMsg, continueMsg, drawOptions, snapOptions);

    const onClickHandler = useCallback(() => {
        interaction.start();
    }, [interaction]);

    useEffect(() => {
        //response from interaction is returned with all translated features
        if(defined(interaction.distance) && defined(interaction.feature) ) {
            onDistance && onDistance(interaction.feature, interaction.distance);
            interaction.clear();
        }
        if(interaction.feature === undefined && interaction.distance === undefined) {
            interaction.clear();
        }
    }, [interaction, onDistance]);

    return (
        <React.Fragment>
            {showTooltip ?
                <Tooltip title="Get Distance" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                    <Button {...otherProps} onClick={onClickHandler}>
                        {children}
                    </Button>
                </Tooltip>
                :
                <Button {...otherProps} onClick={onClickHandler}>
                    {children}
                </Button>
            }
        </React.Fragment>
        
    );
};

GetDistanceButton.propTypes = {
    /**
     * The ol/Map
     */
     map: PropTypes.instanceOf(Map).isRequired,

    /**
     * The vector source where the line distance will be stored. If null a temporary layer will be created
     */
    vectorSource: PropTypes.instanceOf(VectorSource),

    /**
     * The message tooltip show before the user selects the first point
     */
    startMsg: PropTypes.string,

    /**
     * The message tooltip show after the user selects the first point.
     */
    continueMsg: PropTypes.string,

    /**
     * The options to draw the distance line.
     * Check the options parameter in <a href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html">documentation</a>.
     */
    drawOptions: PropTypes.object,

    /**
     * The snap options to draw the distance line.
     * Check the options parameter in <a href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Snap-Snap.html">documentation</a>.
     */
     snapOptions: PropTypes.object,

     /**
      * the handler function having as parameter the linestring and its geodesic length
      */
     onDistance: PropTypes.func,

     /**
     * The child node for the button
     */
    children: PropTypes.node
}

export default GetDistanceButton;