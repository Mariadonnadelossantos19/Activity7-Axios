import  { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

const Update = ({ record, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    // Fetch existing names when component mounts
    axios
      .get("https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/")
      .then((res) => {
        const names = res.data.map((item) => item.name);
        setExistingNames(names);
      })
      .catch((error) => {
        console.error("Error fetching existing data: ", error);
      });
  }, []);

  const handleCancel = () => {
    setVisible(false);
    onCancel(); // Call onCancel function provided by parent component
  };

  const onFinish = async (values) => {
    const { name} = values;

    if (existingNames.includes(name) && name !== record.name) {
      message.error("Name already exists. Please enter a different name.");
      return;
    }

    if (name.length < 3) {
      message.error('Please enter at least three characters for the name.');
      return;
    }


    try {
      await axios.put(
        `https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/${record._id}`,
        values
      );
      message.success("Data updated successfully");
      onUpdate(record._id, values); // Call onUpdate function provided by parent component
      form.resetFields();
      setVisible(false);
      onCancel(); // Call onCancel function provided by parent component
    } catch (error) {
      console.error("Error updating data: ", error);
      message.error("Failed to update data");
    }
  };

  return (
    <div>
      <Modal
        title="Update Author"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ name: record.name, age: record.age }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
          name="age"
          label="Age"
          rules={[
            { required: true, message: "Please input the age!" },
            () => ({
              validator(_, value) {
                if (!value || !isNaN(Number(value))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Please enter a valid number for the age!"));
              },
            }),
          ]}
        >
          <Input type="number" />
        </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// PropTypes validation
Update.propTypes = {
  record: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default Update;