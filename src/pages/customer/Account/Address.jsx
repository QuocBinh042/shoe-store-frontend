import React, { useEffect, useState } from "react";
import { Card, Button, Modal, List, Tag, Typography, message } from "antd";
import AddressAddForm from "./AddressAddForm ";
import AddressEditForm from "./AddressEditForm";
import { fetchAddressByUser, deleteAddress } from "../../../services/addressService";
import { useSelector } from "react-redux";
const { Text } = Typography;
const { confirm } = Modal;

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editAddress, setEditAddress] = useState(null); 
  const user = useSelector((state) => state.account.user);
  useEffect(() => {
    if (user?.userID) {
      loadAddressUser(user.userID);
    } else {
      setAddresses([]);
    }
  }, [user]);

  const loadAddressUser = async (userId) => {
    try {
      const fetchAddress = await fetchAddressByUser(userId);
      setAddresses(fetchAddress);
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((address) => address.addressID !== id));
      message.success("Address deleted successfully.");
    } catch (error) {
      console.error("Failed to delete address:", error);
      message.error("Failed to delete address.");
    }
  };

  const showConfirmDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this address?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDeleteAddress(id),
    });
  };

  const handleAddAddress = (newAddress) => {
    loadAddressUser(user.userID)
    setAddresses([...addresses, { addressID: addresses.length + 1, ...newAddress }]);

    setIsModalVisible(false);
  };

  const handleEditAddress = (updatedAddress) => {
    loadAddressUser(user.userID)
    setAddresses(
      addresses.map((addr) =>
        addr.addressID === updatedAddress.addressID ? updatedAddress : addr
      )
    );
    setIsModalVisible(false);
    setEditAddress(null);
  };

  const openModal = (address = null) => {
    setEditAddress(address); 
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>
        <Button type="primary" onClick={() => openModal()}>
          Add New Address
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item>
            <Card
              bordered
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>{item.type}</Text>
                {item.default && <Tag color="blue">Default</Tag>}
              </div>
              <p>
                <Text strong>{item.fullName}</Text>
                <br />
                <Text>{item.phone}</Text>
                <br />
                <Text>{item.street}, {item.ward}, {item.district}, {item.city}</Text>
              </p>
              <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                <div>
                  <Button type="link" onClick={() => openModal(item)}>
                    Edit
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => showConfirmDelete(item.addressID)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={editAddress ? "Edit Address" : "Add New Address"}
        open={isModalVisible}
        width={500}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editAddress ? (
          <AddressEditForm initialData={editAddress} onSubmit={handleEditAddress} />
        ) : (
          <AddressAddForm onSubmit={handleAddAddress} />
        )}
      </Modal>
    </div>
  );
};

export default AddressManagement;
