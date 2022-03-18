import React, {useCallback, useEffect, useState} from 'react';
import {Map} from 'ol';
import {Projection} from 'ol/proj';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import useGetPointGeomInteraction from '../../../../hooks/interactions/useGetPointGeomInteraction';
import CoordinateWnd from '../../../window/coordinate/CoordinateWnd/CoordinateWnd';

/**
 * <p>Button to retrieve the coordinate indicated by the user.</p>
 *
 * @visibleName Get Coordinate Button 
 */
const GetCoordinateButton = (
    {
        map,
        wndStyle, 
        msg = 'Pick Coordinate',
        projs,
        children = 'Get Coordinate',
        ...otherProps
    }) => {

        const interaction = useGetPointGeomInteraction(map, msg);
        const [position, setPosition] = useState(null);
        const [visibleWnd, setVisibleWnd] = useState(false);
        

        const onClickHandler = useCallback((event) => {
            interaction.start();
        }, [interaction]);

        const onClose = useCallback(() => {
            setVisibleWnd(false);
            setPosition(null);
        }, []);
    
        useEffect(() => {
            if(interaction.geometry && !interaction.isRunning) {
                setPosition(interaction.geometry);
                setVisibleWnd(true);
                interaction.clear();
            }
        
        },[interaction]);

        return(
            <React.Fragment>
                <Button {...otherProps} onClick={onClickHandler} 
                    disabled={interaction.isRunning || visibleWnd}
                >
                    {children}
                </Button>
                { position &&
                    <CoordinateWnd 
                        //title='Get Coordinate'
                        title={children}
                        onClose = {onClose}
                        visible={visibleWnd}
                        map={map}
                        coordinate={position? position.getCoordinates() : null}
                        coordinateProj={map.getView().getProjection()}
                        projs={projs}
                        style={wndStyle}
                    />
                }
            </React.Fragment>
        );

};

GetCoordinateButton.propTypes = {
    /**
     * The OpenLayers ol/Map from where the coordinate will be 
     * retrieved.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Array of ol/Projection to be available
     * in the window. So, the default projection once
     * the window is shown is the map projection. But
     * the user can select a different projection in the
     * window and the coordinate will be converted to
     * the selected projection.
     */
    projs: PropTypes.arrayOf(PropTypes.instanceOf(Projection)),

    /**
     * The prompt message requesting the user to indicate a 
     * position in the map.
     */
    msg: PropTypes.string,

     /**
     * A CSS Style to render the style for the Window
     */
    wndStyle:PropTypes.object,

     /**
     * The child node for the Button and Window Title:
     */
    children: PropTypes.node
};

export default GetCoordinateButton;