import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {Table, Tabs} from 'antd';
import OlGeomGeometry from 'ol/geom/Geometry';
import Window from '../../base/Window/Window';
import './FeaturePropertiesWnd.css';


const FeaturePropertiesWnd = ({
    title,
    style= {width:500},
    features,
    onClose,
    onCancel,
    visible,
    ...otherProps
}) => {

    /**
     * Method to build the Table datasources from the array of features
     * 
     */
    const buildDataSourcesFromFromFeatures = useCallback((features) => {
        if(!features || features.length === 0) return [[]];
        const dataSources = [];
        features.forEach((feature) => {
            const properties = feature.getProperties();
            let idx = 0;
            const dataSource = [];
            for(const property in properties) {
                const item = {}
                if(!(properties[property] instanceof OlGeomGeometry)) {
                    item['key'] = idx.toString();
                    item['name'] = property;
                    item['value'] = properties[property];
                    idx = idx + 1;
                    dataSource.push(item);
                }
            }
            dataSources.push(dataSource);
        });
        
        return dataSources;
    }, []);

    const getFeatureIds = useCallback((features) => {
        const ids = [];
        if(!features || features.length === 0) return ids;
        features.forEach((feature) => {
            ids.push(feature.getId());
        });
        return ids;
    },[]);

    const [dataSources, setDataSources] = useState(buildDataSourcesFromFromFeatures(features));
    const [featureIds, setFeatureIds] = useState(getFeatureIds(features));
    const tabItems = useMemo(() => {
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Value',
              dataIndex: 'value',
              key: 'value',
            },
        ];
        const scroll = {scrollToFirstRowOnChange:true, x:400, y: 400};
        const items = dataSources.map((ds, idx) => {
            return({
                key: idx.toString(),
                label: featureIds[idx],
                children: <Table 
                            dataSource={ds} 
                            columns={columns}  
                            size='middle'
                            tableLayout='auto'
                            pagination= {false}
                            scroll={scroll}
                            bordered
                            sticky
                        />
            });
        });
        return items;
    }, [dataSources, featureIds]);

    
    
    useEffect(() => {
        if(features && features.length > 0) {
            setDataSources(buildDataSourcesFromFromFeatures(features));
            setFeatureIds(getFeatureIds(features));
        }
    }, [buildDataSourcesFromFromFeatures, features, getFeatureIds]);

    return (
        <Window 
            title={title} 
            collapsible 
            visible={visible} 
            onCancel={onCancel} 
            onClose={onClose} 
            style={style}
            {...otherProps}
        >
            <div className="rolext-featureproperties-container">
                <Tabs defaultActiveKey={['0']} tabPosition="top" items={tabItems}/>
            </div>
        </Window>     
    );
};

export default FeaturePropertiesWnd;