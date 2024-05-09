import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const Add = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
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

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    const { name, age } = values;
    if (existingNames.includes(name)) {
      message.error('Name already exists. Please enter a different name.');
      return;
    }

    if (name.length < 3) {
      message.error('Please enter at least three characters for the name.');
      return;
    }

    if (isNaN(age) || age === "") {
      message.error('Please enter a valid number for the age.');
      return;
    }


    axios
      .post("https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/", values)
      .then((res) => {
        onAdd(res.data, () => {
          message.success('Data added successfully');
          form.resetFields();
          setVisible(false);
        });
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
      });
  };

  return (
    <>
      <Button className="left-5" type="primary" onClick={showModal}>
        + Add New Author
      </Button>
      <Modal
        title="Add New Author"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please enter age' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// PropTypes validation
Add.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Add;