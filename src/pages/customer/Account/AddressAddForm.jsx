import React, { useState, useEffect } from "react";
import { Input, Select, Button, Checkbox, message } from "antd";
import { addAddress } from "../../../services/addressService";
import { fetchAddressByUser,updateAddress } from "../../../services/addressService";
import { useSelector } from "react-redux";
const AddressAddForm = ({ onSubmit }) => {
  const [tinhList, setTinhList] = useState([]);
  const [quanList, setQuanList] = useState([]);
  const [phuongList, setPhuongList] = useState([]);
  const user = useSelector((state) => state.account.user);
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedQuan, setSelectedQuan] = useState(null);
  const [selectedPhuong, setSelectedPhuong] = useState(null);
  const [street, setStreet] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Home");
  const [isDefault, setIsDefault] = useState(false);
  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setTinhList(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedTinh) {
      setSelectedQuan(null);
      setSelectedPhuong(null);
      setQuanList([]);
      setPhuongList([]);

      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedTinh}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setQuanList(data.data);
          }
        });
    } else {
      setQuanList([]);
      setPhuongList([]);
    }
  }, [selectedTinh]);

  useEffect(() => {
    if (selectedQuan) {
      setSelectedPhuong(null);
      setPhuongList([]);

      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedQuan}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setPhuongList(data.data);
          }
        });
    } else {
      setPhuongList([]);
    }
  }, [selectedQuan]);


  const handleAddAddress = async () => {
    if (!fullName || !phone || !street || !selectedTinh || !selectedQuan || !selectedPhuong) {
      message.error("Please fill in all required fields.");
      return; 
    }
    if (isDefault) {
      await updateAddressToRemoveDefault(); 
    }

    const addressData = {
      city: tinhList.find((t) => t.id === selectedTinh)?.full_name || "",
      district: quanList.find((q) => q.id === selectedQuan)?.full_name || "",
      ward: phuongList.find((p) => p.id === selectedPhuong)?.full_name || "",
      street,
      fullName,
      phone,
      type,
      default: isDefault,
      user: { userID: user.userID },
    };

    try {
      const result = await addAddress(addressData);
      if (result) {
        message.success("Address added successfully!");
        onSubmit(addressData); 
        clearForm();
      } else {
        message.error("Failed to add address.");
      }
    } catch (error) {
      message.error("An error occurred while adding the address.");
      console.error(error);
    }
  };
  const updateAddressToRemoveDefault = async () => {
    try {
      const addresses = await fetchAddressByUser(user.userID); 
      const defaultAddress = addresses.find(address => address.default);

      if (defaultAddress) {
        defaultAddress.default = false;
        await updateAddress(defaultAddress.addressID, defaultAddress); 
      }
    } catch (error) {
      console.error("Failed to remove default address:", error);
    }
  };


  const clearForm = () => {
    setSelectedTinh(null);
    setSelectedQuan(null);
    setSelectedPhuong(null);
    setStreet("");
    setFullName("");
    setPhone("");
    setType("Home");
    setIsDefault(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Select placeholder="Tỉnh" value={selectedTinh} onChange={(value) => setSelectedTinh(value)}>
        {tinhList.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.full_name}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Quận/Huyện"
        value={selectedQuan}
        onChange={(value) => setSelectedQuan(value)}
      >
        {quanList.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.full_name}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Phường/Xã"
        value={selectedPhuong}
        onChange={(value) => setSelectedPhuong(value)}
      >
        {phuongList.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.full_name}
          </Select.Option>
        ))}
      </Select>
      <Input placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
      <Select placeholder="Address Type" value={type} onChange={(value) => setType(value)}>
        <Select.Option value="Home">Home</Select.Option>
        <Select.Option value="Office">Office</Select.Option>
        <Select.Option value="Other">Other</Select.Option>
      </Select>
      <Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}>
        Set as default address
      </Checkbox>
      <Button type="primary" onClick={handleAddAddress}>Add Address</Button>
    </div>
  );
};

export default AddressAddForm;
