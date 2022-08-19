import {EnvironmentOutlined } from '@ant-design/icons';
import CustomControl from '../CustomControl';
import GetCoordinateButton from '../../../../../button/coordinate/GetCoordinateButton/GetCoordinateButton';
import './CoordinateControl.css';

const CoordinateControl = ({
    map,
    options = {
        target: undefined,
        className: 'rolext-coordinate-control'
    },
    projs = [map.getView().getProjection()],
    children
}) => {
    return (
        <CustomControl map={map} options={options}>
                <GetCoordinateButton icon= {<EnvironmentOutlined />}  
                                     type='primary' map={map}
                                     projs={projs}
                >
                    {children}
                </GetCoordinateButton>
        </CustomControl>
    );

};

export default CoordinateControl;