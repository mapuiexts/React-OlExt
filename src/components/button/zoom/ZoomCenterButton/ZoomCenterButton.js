import {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {transform, Projection} from 'ol/proj';
import {Map} from 'ol';
import Window from '../../../window/base/Window/Window';
import CoordinateForm from '../../../form/coordinate/CoordinateForm/CoordinateForm';
import defined from '../../../../core/defined';
import {stringToCoordinate, zoomCenter} from '../../../../util/map';

/**
 * Button to Zoom the map having the center and scale provided by the user
 * in thw window.
 * 
 * @visibleName Zoom Center Button
 */

const ZoomCenterButton = ({
    map,
    wndProps = {style: {width:'32rem'}},
    projs,
    defaultScaleDenominator = 500,
    children,
    ...otherProps
}) => {

    const [visibleWnd, setVisibleWnd] = useState(false);

    const initialValues = {
        projection: map.getView().getProjection().getCode(),
        coordinateStr: undefined,
        scaleDenominator: defaultScaleDenominator
    };

    const onClose = useCallback(() => {
        setVisibleWnd(false);
    }, []);

    const onClickHandler = useCallback((event) => {
        setVisibleWnd(true);
    }, []);

    const onFinishHandler = useCallback((values) => {
        let coordinate = stringToCoordinate(values.coordinateStr, values.projection);
        const mapProjCode = map.getView().getProjection().getCode();
        if(defined(coordinate)) {
            if(values.projection !== mapProjCode) {
                coordinate = transform(coordinate, values.projection, mapProjCode);
            }
            //zoom to coordinate
            zoomCenter(map, values.scaleDenominator, coordinate[0], coordinate[1]);
            //set popup

        }
        setVisibleWnd(false);
    }, [map])

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
        </>
    );
};

ZoomCenterButton.propTypes = {
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

export default ZoomCenterButton;