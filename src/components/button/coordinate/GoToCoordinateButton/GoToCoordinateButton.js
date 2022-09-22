import {useCallback, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {transform, Projection} from 'ol/proj';
import {Map} from 'ol';
import Window from '../../../window/base/Window/Window';
import CoordinateForm from '../../../form/coordinate/CoordinateForm/CoordinateForm';
import BasePopup from '../../../popup/base/BasePopup/BasePopup';
import defined from '../../../../core/defined';
import {getCoordinateLabel, stringToCoordinate, zoomCenter} from '../../../../util/map';

/**
 * Button to Zoom the map having the position and scale provided by the user
 * in thw window.
 * A popup will be show in the map in the specified position
 * 
 * @visibleName Go To Coordinate Button
 */

const GoToCoordinateButton = ({
    map,
    wndProps = {style: {width:'32rem'}},
    projs,
    defaultProjCode= map.getView().getProjection().getCode(),
    defaultScaleDenominator = 500,
    children,
    ...otherProps
}) => {

    const [visibleWnd, setVisibleWnd] = useState(false);
    const [positionInfo, setPositionInfo] = useState(undefined);

    const initialValues = {
        projection: defaultProjCode,
        coordinateStr: undefined,
        scaleDenominator: defaultScaleDenominator
    };

    const calculateMapPosition = useCallback((positionStr, projCode) => {
        let position = stringToCoordinate(positionStr, projCode);
        const mapProjCode = map.getView().getProjection().getCode();
        if(defined(position)) {
            if(projCode !== mapProjCode) {
                position = transform(position, projCode, mapProjCode);
            }
        }
        return position;
    }, [map]);


    /**
     * callback called once the user closes the window
     */
    const onClose = useCallback(() => {
        setVisibleWnd(false);
        setPositionInfo(undefined);
    }, []);

    /**
     * Callback called once the user closes the poput
     */
    const onClosePopup = () => {
        setPositionInfo(undefined);
    };

    /**
     * Content to be shown inthe map
     */
    const content = useMemo(() => {
        let position = undefined;
        let projection = undefined;
        if(defined(positionInfo) && defined(positionInfo.coordinateStr)) {
            position = stringToCoordinate(positionInfo.coordinateStr, positionInfo.projection);
            projection = positionInfo.projection
        }
        return (
            <div>
                <p><strong>{defined(projection) ? `${getCoordinateLabel(projection)}=>${projection}:` : ''}</strong></p>
                {positionInfo &&
                    <>
                        <p>X: {position[0]}</p>
                        <p>Y: {position[1]}</p>
                    </>
                }
            </div>
        );
    }, [positionInfo]);
    

    const onClickHandler = useCallback((event) => {
        setVisibleWnd(true);
    }, []);


    const onFinishHandler = useCallback((values) => {
        console.log(values);
        let coordinate = calculateMapPosition(values.coordinateStr, values.projection);
        if(defined(coordinate)) {
            const centerChanged = (evt) => {
                console.log('center changed');
                setPositionInfo(values);
            }
            map.once('moveend', centerChanged);




            //set popup position
            //setPositionInfo(values);
            //zoom to coordinate
            zoomCenter(map, values.scaleDenominator, coordinate[0], coordinate[1]);
        }
        //setVisibleWnd(false);
    }, [map, calculateMapPosition])

    return (
        <>
            <Button {...otherProps} onClick={onClickHandler} 
                    disabled={visibleWnd}
                >
                    {children}
                </Button>
                { visibleWnd &&
                    <Window 
                        {...wndProps}
                        title={defined(children) ? children : 'Go To Coordinate'} 
                        onClose = {onClose}
                        visible={visibleWnd}
                        projs={projs}
                    >
                        <CoordinateForm 
                            map={map}
                            projs={projs}
                            initialValues = {initialValues}
                            onFinish={onFinishHandler}
                        />
                    </Window>
                }
                {defined(positionInfo) &&
                    <BasePopup 
                        map={map}
                        position={calculateMapPosition(positionInfo.coordinateStr, positionInfo.projection)}
                        onClose={onClosePopup}
                    >
                        {content}
                    </BasePopup>
                }
        </>
    );
};

GoToCoordinateButton.propTypes = {
    /**
     * The OpenLayers ol/Map to zoom
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Array of ol/Projection to be available
     * in a combo box in the window. So, the user will be able
     * to enter a coordinate in a selected 
     * projection, other than the map projection.
     */
    projs: PropTypes.arrayOf(PropTypes.instanceOf(Projection)),

    /**
     * The initial scale denominator to be show in
     * the window.
     */
    defaultScaleDenominator: PropTypes.number,

    /**
     * The properties for the window
     */
    wndProps:PropTypes.object,

    /**
     * The child node for the Button and Window Title:
     */
    children: PropTypes.node
};

export default GoToCoordinateButton;