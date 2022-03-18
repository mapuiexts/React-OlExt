import React from 'react';
import {Tabs} from 'antd';
import {Form, Button, Space} from 'antd';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';


const layout = {
    labelAlign: 'left',
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 10,
        span: 3
    },
};

/**
 * A basic Form for the ol/layer/Base Layer.
 */
const EditLayerForm = ({
    layer,
    onFinish,
    onFinishFailed,
    tabs = [
        {
            title: "General",
            key: "general",
            isDefault: true,
            el: GeneralTab
        }
    ],
    ...otherProps
}) => {
    const [form] = Form.useForm();

    //get first key as the default active key for the tab
    let defaultActiveKey = tabs[0].key;
    //get options
    let opts = {};
    tabs.forEach((tab) => {
        opts = {
            ...opts,
            ...tab.el.getOpts(layer)
        };
        if(tab.isDefault === true) {
            defaultActiveKey = tab.key;
        }
    });
    
    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue(opts);
    };

    return(
        <Form 
            {...layout} 
            //layout="vertical"
            form={form} 
            name="edit-layer-form" 
            onFinish={onFinish}
            initialValues = {opts}
        >
        <Tabs defaultActiveKey={defaultActiveKey}>
            {tabs.map((Tab) => {
                const TabItem = Tab.el;
                return(
                    <Tabs.TabPane tab={Tab.title} key={Tab.key}>
                        <TabItem mode="edit"/>
                    </Tabs.TabPane>
                );
            })}
        </Tabs>

        <Form.Item 
            {...tailLayout}
        >
            <Space>
                <Button  type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>
                <Button type="link" htmlType="button" onClick={onFill}>
                    Fill form
                </Button>
            </Space>
        </Form.Item>
        </Form>
    );
};

export default EditLayerForm;