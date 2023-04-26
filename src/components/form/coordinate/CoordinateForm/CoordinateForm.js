
import { useCallback, useState } from "react";
import { Form, Select, Input, InputNumber, Space, Button } from "antd";
import {get as getProjection} from 'ol/proj/projections';
import defined from '../../../../core/defined';
import {getCoordinateLabel, coordinateToString, stringToCoordinate} from '../../../../util/map';

const layout = {
    labelAlign: 'left',
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 18,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 10,
        span: 3,
    },
    labelAlign: 'left',
};

const CoordinateForm = ({
    map,
    projs,
    initialValues,
    onFinish,
    onFinishFailed,
    ...otherProps
}) => {

    const [form] = Form.useForm();
    const [curProjCode, setCurProjCode] = useState(initialValues.projection);


    /**
     * Handler called once the projection is changed in the combo box
     */
     const onProjChangeHandler = useCallback((value) => {
        //parse x and y values from input
        const oldCoordinate = stringToCoordinate(form.getFieldValue('coordinateStr'), curProjCode);
        if(defined(oldCoordinate))
            form.setFieldsValue({
                coordinateStr: coordinateToString(oldCoordinate, curProjCode, value)
            });
        else
            form.setFieldsValue({coordinateStr: undefined});
        setCurProjCode(value);
    }, [form, curProjCode]);

    const onReset = () => {
        form.resetFields();
        setCurProjCode(form.getFieldValue('projection'));
    };



    return (
        <Form
            {...layout}
            {...otherProps}
            form={form}
            name="coordinate-form" 
            onFinish={onFinish}
            initialValues = {initialValues}
        >
                {/* Projection */}
                <Form.Item
                    name="projection"
                    label="Projection"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select 
                        //defaultValue={defaultProj}
                        onChange={onProjChangeHandler}
                    >
                        {projs.map((proj) => {
                            return (
                                <Select.Option key={proj.getCode()} value={proj.getCode()}>
                                    {proj.getCode()}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                {/* Coordinate String*/}
                <Form.Item
                    name="coordinateStr"
                    label="Coordinate"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input 
                        addonBefore={getCoordinateLabel(curProjCode)}
                        placeholder={
                            getProjection(curProjCode).getAxisOrientation() !== 'neu'? 'X, Y': 'Y, X'
                        }
                    />
                </Form.Item>
                {/* Scale Denominator*/}
                <Form.Item
                    name="scaleDenominator"
                    label="Scale"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        step={100}
                        min={10}
                        formatter={(value) => { 
                            return `1/${value}`;
                        }}
                        parser={(value) => { 
                            if(value &&  value.split('/').length === 2) {
                                return value.split('/')[1].trim();
                            }
                            return undefined;
                        }}
                        placeholder="1/Scale"
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button  type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
        </Form>
    );
};

export default CoordinateForm;