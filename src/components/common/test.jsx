import React, { useState } from "react";
import { Form, Select, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (index, newSelectedItems) => {
    const newItems = [...selectedItems];
    newItems[index] = newSelectedItems;
    setSelectedItems(newItems);
  };

  // Hàm để lọc các tùy chọn cho mỗi Select
  const filteredOptions = (index) => {
    // Lấy tất cả các mục đã chọn ngoại trừ mục ở vị trí index hiện tại
    const selectedExcludingCurrent = selectedItems
      .flat()
      .filter((_, i) => i !== index);
    // Lọc các tùy chọn không có trong selectedExcludingCurrent
    return OPTIONS.filter(
      (option) => !selectedExcludingCurrent.includes(option)
    );
  };

  return (
    <Form>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item key={field.key}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Select
                    mode="multiple"
                    placeholder="Inserted are removed"
                    value={selectedItems[index] || []}
                    onChange={(value) => handleChange(index, value)}
                    style={{ width: "100%" }}
                    options={filteredOptions(index).map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      style={{ marginLeft: "8px" }}
                      onClick={() => {
                        const newItems = [...selectedItems];
                        newItems.splice(index, 1);
                        setSelectedItems(newItems);
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </div>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                  setSelectedItems([...selectedItems, []]);
                }}
                style={{ width: "100%" }}
                icon={<PlusOutlined />}
              >
                Add item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default App;
