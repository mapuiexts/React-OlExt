import NewLayerForm from '../NewLayerForm/NewLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';

const NewDefaultLayerForm = ({
    layerOpts, 
    onFinish
}) => {

    return(
        <NewLayerForm 
            layerOpts={layerOpts} 
            onFinish={onFinish}
            GeneralTab={GeneralTab}
        />
    );
};

export default NewDefaultLayerForm;
