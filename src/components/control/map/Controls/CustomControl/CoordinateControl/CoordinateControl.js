import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {EnvironmentOutlined } from '@ant-design/icons';
import CustomControl from '../CustomControl';
import { GetCoordinateButton, GoToCoordinateButton } from '../../../../../../main';
import './CoordinateControl.css';

const CoordinateControl = ({
    map,
    icon= <EnvironmentOutlined/>,
    dropDownProps = null,
    tooltipProps = null,
    projs = [map.getView().getProjection()],
    defaultProjCode= map.getView().getProjection().getCode(),
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

    const menuProps = useMemo(() => {
        return({
            items: [
                {
                    key:    'GET_COORDINATE',
                    label:  <GetCoordinateButton 
                                type='text' 
                                size="small" 
                                map={map} 
                                wndProps = {wndProps}
                                projs = {projs}
                                defaultProjCode={defaultProjCode}
                            >
                                Get Coordinate
                            </GetCoordinateButton>
                },
                {
                    key:    'GOTO_COORDINATE',
                    label:  <GoToCoordinateButton 
                                type='text' 
                                size="small" 
                                map={map} 
                                wndProps = {wndProps}
                                projs = {projs}
                                defaultProjCode={defaultProjCode}
                                defaultScaleDenominator = {defaultScaleDenominator}
                            >
                                Go To Coordinate
                            </GoToCoordinateButton>
                }
            ]
        });
    }, [defaultProjCode, defaultScaleDenominator, map, projs, wndProps]);

    return (
        <CustomControl map={map} options={options}>
            <Dropdown trigger="click" 
                      placement="bottomLeft"
                      menu={menuProps}
                      {...dropDownProps}
            >
                <Tooltip title="Coordinate" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                    <Button type="primary" icon= {icon} {...otherProps}>
                        {children}
                    </Button>
                </Tooltip>
            </Dropdown>  
        </CustomControl>
    );

};

export default CoordinateControl;