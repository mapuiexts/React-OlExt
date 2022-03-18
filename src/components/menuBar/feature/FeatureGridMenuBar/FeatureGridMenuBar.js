import React from 'react';
import { Space, Dropdown, Button, Menu } from 'antd';
import ZoomToAllFeaturesButton from '../../../button/zoom/ZoomToAllFeaturesButton/ZoomToAllFeaturesButton';
import ZoomToSelectedFeaturesButton from '../../../button/zoom/ZoomToSelectedFeaturesButton/ZoomToSelectedFeaturesButton';
import ClearAllFeaturesButton from '../../../button/feature/ClearAllFeaturesButton/ClearAllFeaturesButton';
import ClearSelectedFeaturesButton from '../../../button/feature/ClearSelectedFeaturesButton/ClearSelectedFeaturesButton';

const FeatureGridMenuBar = ({
    map,
    layer,
    gridApi
}) => {
    const zoomMenu = (
        <Menu>
            <Menu.Item>
                <ZoomToAllFeaturesButton type="text" map={map} vectorLayer={layer}>
                    Zoom All
                </ZoomToAllFeaturesButton>
            </Menu.Item>
            <Menu.Item>
                <ZoomToSelectedFeaturesButton type='text' map={map} gridApi={gridApi}>
                    Zoom to Selected Feature(s)
                </ZoomToSelectedFeaturesButton>
            </Menu.Item>
        </Menu>
    );

    const clearMenu = (
        <Menu>
            <Menu.Item>
                <ClearAllFeaturesButton type='text' vectorLayer={layer}>
                    Clear All
                </ClearAllFeaturesButton>
            </Menu.Item>
            <Menu.Item>
                <ClearSelectedFeaturesButton type="text" gridApi={gridApi} vectorLayer={layer}>
                    Clear Selected Feature(s)
                </ClearSelectedFeaturesButton>
            </Menu.Item>
        </Menu>
    );
    return (
        <React.Fragment>
            <Space >
                <Dropdown overlay={clearMenu} placement="bottomLeft">
                    <Button>Clear</Button>
                </Dropdown>
                <Dropdown overlay={zoomMenu} placement="bottomLeft" >
                    <Button>Zoom</Button>
                </Dropdown>
            </Space>
        </React.Fragment>
    );
};


export default FeatureGridMenuBar;