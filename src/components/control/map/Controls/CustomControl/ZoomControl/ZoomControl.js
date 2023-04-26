import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {ZoomInOutlined  } from '@ant-design/icons';
import CustomControl from '../CustomControl';
import { ZoomCenterButton } from '../../../../../../main';
import './ZoomControl.css';

/**
 * Control with zoom options
 * @visibleName Zoom Control
 */
const ZoomControl = ({
    map,
    projs,
    defaultScaleDenominator = 500,
    defaultProjCode= map.getView().getProjection().getCode(),
    icon= <ZoomInOutlined  />,
    dropDownProps = null,
    tooltipProps = null,
    ...otherProps
}) => {

    const options = useMemo(() => {
        return({
            target: undefined,
            className: 'rolext-zoom-control'
        });
    }, []);

    const menuProps = useMemo(() => {
        return({
            items: [
                {
                    key: 'ZOOM_CENTER',
                    label: <ZoomCenterButton 
                                type='text' size="small" 
                                map={map}
                                projs={projs}
                                defaultScaleDenominator={defaultScaleDenominator}
                                defaultProjCode={defaultProjCode}
                            >
                            Zoom Center
                           </ZoomCenterButton>
                }
            ]
        });
    }, [map, defaultProjCode, defaultScaleDenominator, projs]);

    return (
        <CustomControl map={map} options={options}>
            <Dropdown 
                trigger="click" 
                placement="bottomLeft"
                menu={menuProps}
                {...dropDownProps}
            >
                <Tooltip title="Zoom" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                    <Button type="primary" icon= {icon} {...otherProps}/>
                </Tooltip>
            </Dropdown>  
        </CustomControl>
    );
};

export default ZoomControl;