// import { Button, Tabs } from "antd";
// import React, { useRef, useState, useEffect } from "react";
// import Table1 from "./Table";

// //xử lý table
// const columns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//   },
// ];
// const data = [];

// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

// //xử lý tab
// const defaultPanes = new Array(2).fill(null).map((_, index) => {
//   const id = String(index + 1);
//   return {
//     label: `Tab ${id}`,
//     children: <Table1 key={1}/>,
//     key: id,
//   };
// });

// function CreateOrder() {
//   const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
//   const [items, setItems] = useState(defaultPanes);
//   const newTabIndex = useRef(0);
//   const [ProvinceName, setProvinceName] = useState([])

//   const onChange = (key) => {
//     setActiveKey(key);
//   };

//   const add = () => {
//     const newActiveKey = `newTab${newTabIndex.current++}`;
//     setItems([
//       ...items,
//       {
//         label: `Tab ${newTabIndex.current}`,
//         children: <Table1 />,
//         key: newActiveKey,
//       },
//     ]);
//     setActiveKey(newActiveKey);
//   };

//   const remove = (targetKey) => {
//     const targetIndex = items.findIndex((pane) => pane.key === targetKey);
//     const newPanes = items.filter((pane) => pane.key !== targetKey);

//     if (newPanes.length && targetKey === activeKey) {
//       const { key } =
//         newPanes[
//           targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
//         ];
//       setActiveKey(key);
//     }

//     setItems(newPanes);
//   };

//   const onEdit = (targetKey, action) => {
//     if (action === "add") {
//       add();
//     } else {
//       remove(targetKey);
//     }
//   };

//   //call Api tỉnh thành


//   return (
//     //xử lý table

//     <div
//       className="row"
//       style={{
//         borderRadius: "20px",
//         height: "auto",
//         paddingBottom: "40px",
//         border: "1px solid #d9d9d9",
//         background: "#fafafa",
//       }}
//     >
//       <div
//         className="mt-4"
//         style={{
//           marginBottom: 16,
//         }}
//       >
//         <Button onClick={add}>Thêm hoá đơn</Button>
//       </div>
//       <Tabs
//         hideAdd
//         onChange={onChange}
//         activeKey={activeKey}
//         type="editable-card"
//         onEdit={onEdit}
//         items={items}
//       />
//     </div>
//   );
// }

// export default CreateOrder;
