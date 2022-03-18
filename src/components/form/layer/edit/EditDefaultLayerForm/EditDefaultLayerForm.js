import {useCallback} from 'react';
import EditLayerForm from '../EditLayerForm/EditLayerForm';
import {normalizeStringInObject} from '../../../../../util/common';

const EditDefaultLayerForm = ({
    layer, 
    onFinish
}) => {

    const onInternalFinish = useCallback((values) => {
        const {source, ...properties} = values;
        normalizeStringInObject(properties);
        layer.setProperties(properties);
        
        //execute onFinish
        onFinish && onFinish(values);
    },[layer, onFinish]);

    return(
        <EditLayerForm 
            layer={layer} 
            onFinish={onInternalFinish}
        />
    );
};

export default EditDefaultLayerForm;
