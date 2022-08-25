import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {EnvironmentOutlined } from '@ant-design/icons';
import CustomControl from '../CustomControl';
import CoordinateMenu from '../../../../../menu/coordinate/CoordinateMenu/CoordinateMenu';
import './CoordinateControl.css';

const CoordinateControl = ({
    map,
    icon= <EnvironmentOutlined/>,
    dropDownProps = null,
    tooltipProps = null,
    projs = [map.getView().getProjection()],
    wndProps = {style: {width:'32rem'}},
    defaultScaleDenominator = 5000,
    children,
    ...otherProps
}) => {
    const options = useMemo(() => {
        return({
            target: undefined,
            className: 'rolext-coordinate-control'
        });
    }, []);

    return (
        <CustomControl map={map} options={options}>
            <Dropdown trigger="click" 
                      placement="bottomLeft"
                      overlay={<CoordinateMenu  map={map} 
                                                projs={projs} 
                                                wndProps={wndProps} 
                                                defaultScaleDenominator={defaultScaleDenominator}
                                />}
                      {...dropDownProps}
            >
                <Tooltip title="Coordinate" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                    <Button type="primary" icon= {icon} {...otherProps}>
                        {children}
                    </Button>
                </Tooltip>
            </Dropdown>  
        </CustomControl>
        // <CustomControl map={map} options={options}>
        //         <GetCoordinateButton icon= {<EnvironmentOutlined />}  
        //                              type='primary' map={map}
        //                              projs={projs}
        //         >
        //             {children}
        //         </GetCoordinateButton>
        // </CustomControl>
    );

};

export default CoordinateControl;