import {InfoOutlined} from '@ant-design/icons';
import CustomControl from '../CustomControl';
import WmsGetFeatureInfoButton from '../../../../../button/wms/WmsGetFeatureInfoButton/WmsGetFeatureInfoButton';
import './FeatureInfoControl.css';

const FeatureInfoControl = ({
    map,
    icon = <InfoOutlined/>,
    shape = 'circle',
    options = {
        target: undefined,
        className: 'rolext-feature-info-control'
    },
    children,
    ...otherProps
}) => {
    return (
        <CustomControl map={map} options={options}>
            {/* <Tooltip title="Feature Info" color="purple" placement="right" mouseLeaveDelay={0.05}> */}
                <WmsGetFeatureInfoButton icon= {icon}  
                                         shape={shape} type='primary' 
                                         map={map}
                                         {...otherProps}

                >
                    {children}
                </WmsGetFeatureInfoButton>
            {/* </Tooltip> */}
        </CustomControl>
    );

};

export default FeatureInfoControl;