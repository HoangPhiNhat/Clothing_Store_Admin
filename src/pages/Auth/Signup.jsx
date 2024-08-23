/* eslint-disable no-unused-vars */
import { Button, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import useAutoFocus from '../../hooks/customHook/useAutoFocus';

const Signup = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useAutoFocus(open);

    const onFinish = (values) => {
        messageApi.success("Signup success");
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        messageApi.error("Signup fail");
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            {contextHolder}
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="p-8 bg-white rounded-lg shadow-lg w-full max-w-lg"
                    style={{ maxWidth: 400 }}
                >
                    <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                    >
                        <Input placeholder="Name" ref={inputRef} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'The input is not valid E-mail!' }
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your Password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Confirm passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Register
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4">
                        <span> Already have an account? </span>
                        <Link to="/signin">Log in</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
