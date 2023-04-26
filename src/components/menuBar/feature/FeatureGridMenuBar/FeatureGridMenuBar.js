import { useMemo }  from 'react';
import { Space, Dropdown, Button } from 'antd';
import ZoomToAllFeaturesButton from '../../../button/zoom/ZoomToAllFeaturesButton/ZoomToAllFeaturesButton';
import ZoomToSelectedFeaturesButton from '../../../button/zoom/ZoomToSelectedFeaturesButton/ZoomToSelectedFeaturesButton';
import ClearAllFeaturesButton from '../../../button/feature/ClearAllFeaturesButton/ClearAllFeaturesButton';
import ClearSelectedFeaturesButton from '../../../button/feature/ClearSelectedFeaturesButton/ClearSelectedFeaturesButton';

const FeatureGridMenuBar = ({
    map,
    layer,
    gridApi
}) => {
    
    const zoomMenuProps = useMemo(() => {
        return({
            items: [
                {
                    key: '1',
                    label: <ZoomToAllFeaturesButton type="text" map={map} vectorLayer={layer}>
                                Zoom All
                            </ZoomToAllFeaturesButton>
                },
                {
                    key: '2',
                    label: <ZoomToSelectedFeaturesButton type='text' map={map} gridApi={gridApi}>
                                Zoom to Selected Feature(s)
                            </ZoomToSelectedFeaturesButton>
                }
            ]
        });
    }, [gridApi, layer, map]);

    const clearMenuProps = useMemo(() => {
        return({
            items: [
                {
                    key: '1',
                    label: <ClearAllFeaturesButton type='text' vectorLayer={layer}>
                                Clear All
                            </ClearAllFeaturesButton>
                },
                {
                    key: '2',
                    label: <ClearSelectedFeaturesButton type="text" gridApi={gridApi} vectorLayer={layer}>
                                Clear Selected Feature(s)
                            </ClearSelectedFeaturesButton>
                }
            ]
        });
    }, [gridApi, layer]);

    return (
        <>
            <Space >
                <Dropdown menu={clearMenuProps} placement="bottomLeft">
                    <Button>Clear</Button>
                </Dropdown>
                <Dropdown menu={zoomMenuProps} placement="bottomLeft" >
                    <Button>Zoom</Button>
                </Dropdown>
            </Space>
        </>
    );
};


export default FeatureGridMenuBar;