import { Button, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Update from './Update';
import Add from './Add';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const DataForm = () => {
    const [updateMode, setUpdateMode] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
    const [data, setData] = useState([]);
    useEffect(() => {
        axios
          .get("https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/")
          .then((res) => {
            setData(res.data);
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
      }, []);
      function handleDelete(id) {
        axios
          .delete( `https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/${id}`)
          .then(() => {
            setData(data.filter((item) => item._id !== id));
            message.success('Data deleted successfully');
          })
          .catch((error) => {
            console.error("Error deleting data: ", error);
          });
      }

      const handleUpdateClick = (record) => {
        setUpdateRecord(record);
        setUpdateMode(true);
      };
    
      const handleUpdate = (id, updatedData) => {
        setData(data.map(item => item._id === id ? { ...item, ...updatedData } : item));
        setUpdateMode(false); // After update, close the modal
      };
    
      const handleAdd = (newData, callback) => {
        // Update the state with the new data
        setData(prevData => [...prevData, newData]);
      
        // Close the add modal if a callback function is provided
        if (callback) {
          callback();
      
          // Additionally, update the state immediately after adding to reflect changes in the table
          axios
            .get("https://bejewelled-donut-e9e32a.netlify.app/.netlify/functions/api/")
            .then((res) => {
              setData(res.data);
            })
            .catch((error) => {
              console.error("Error fetching data: ", error);
            });
        }
      };
    
      
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '50%',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          width: '30%',
        },
        {
            title: (
              <span>
                Action
                <Add onAdd={handleAdd} />
              </span>
            ),
            key: 'action',
            render: (text, record) => (
              <span className="flex gap-3">
                <EditOutlined 
                    style={{
                        width:'3rem'
                    }}
                    onClick={() => handleUpdateClick(record)}
                />
                
                <Popconfirm
                  title="Are you sure you want to delete this data?"
                  onConfirm={() => handleDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined type='primary' color='red'/>
                </Popconfirm>
              </span>
            ),
          },
    ]
    
  return (
    <div className="mt-4">
      <Table columns={columns} dataSource={data} />
      {updateMode && <Update record={updateRecord} onCancel={() => setUpdateMode(false)} onUpdate={handleUpdate} />}
    </div>

    
  )
}

export default DataForm 