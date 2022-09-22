import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {ZoomInOutlined  } from '@ant-design/icons';
import CustomControl from '../CustomControl';
import ZoomMenu from '../../../../../menu/zoom/ZoomMenu/ZoomMenu';
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

    return (
        <CustomControl map={map} options={options}>
            <Dropdown 
                trigger="click" 
                placement="bottomLeft"
                overlay={
                    <ZoomMenu 
                        map={map}
                        projs={projs}
                        defaultScaleDenominator={defaultScaleDenominator}
                        defaultProjCode={defaultProjCode}
                    />
                }
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