import React, { useState, useEffect } from "react";
import { Input, Select, Button, Checkbox, message } from "antd";
import { useSelector } from "react-redux";
import { fetchAddressByUser,updateAddress } from "../../../services/addressService";
const AddressEditForm = ({ initialData, onSubmit }) => {
  const [tinhList, setTinhList] = useState([]);
  const [quanList, setQuanList] = useState([]);
  const [phuongList, setPhuongList] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedQuan, setSelectedQuan] = useState(null);
  const [selectedPhuong, setSelectedPhuong] = useState(null);
  const [street, setStreet] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Home");
  const [isDefault, setIsDefault] = useState(false);
  const user = useSelector((state) => state.account.user);
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
    if (initialData) {
      setStreet(initialData.street || "");
      setFullName(initialData.fullName || "");
      setPhone(initialData.phone || "");
      setType(initialData.type || "Home");
      setIsDefault(initialData.default || false);

      const initialTinh = tinhList.find(tinh => tinh.full_name === initialData.city);
      if (initialTinh) {
        setSelectedTinh(initialTinh.full_name);
        fetch(`https://esgoo.net/api-tinhthanh/2/${initialTinh.id}.htm`)
          .then((response) => response.json())
          .then((data) => {
            if (data.error === 0) {
              setQuanList(data.data);
              const initialQuan = data.data.find(quan => quan.full_name === initialData.district);
              if (initialQuan) {
                setSelectedQuan(initialQuan.full_name);
                fetch(`https://esgoo.net/api-tinhthanh/3/${initialQuan.id}.htm`)
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.error === 0) {
                      setPhuongList(data.data);
                      const initialPhuong = data.data.find(phuong => phuong.full_name === initialData.ward);
                      if (initialPhuong) {
                        setSelectedPhuong(initialPhuong.full_name);
                      }
                    }
                  });
              }
            }
          });
      }
    }
  }, [initialData, tinhList]);

  useEffect(() => {
    if (selectedTinh) {
      const selectedTinhObj = tinhList.find(tinh => tinh.full_name === selectedTinh);
      if (selectedTinhObj) {
        setQuanList([]);
        setPhuongList([]);
        setSelectedQuan(null);
        setSelectedPhuong(null);

        fetch(`https://esgoo.net/api-tinhthanh/2/${selectedTinhObj.id}.htm`)
          .then((response) => response.json())
          .then((data) => {
            if (data.error === 0) {
              setQuanList(data.data);
            }
          });
      }
    }
  }, [selectedTinh]);
  useEffect(() => {
    if (selectedQuan) {
      const selectedQuanObj = quanList.find(quan => quan.full_name === selectedQuan);
      if (selectedQuanObj) {
        setPhuongList([]);
        setSelectedPhuong(null);

        fetch(`https://esgoo.net/api-tinhthanh/3/${selectedQuanObj.id}.htm`)
          .then((response) => response.json())
          .then((data) => {
            if (data.error === 0) {
              setPhuongList(data.data);
            }
          });
      }
    }
  }, [selectedQuan]);

  const handleUpdateAddress = async () => {
    if (!fullName || !phone || !street || !selectedTinh || !selectedQuan || !selectedPhuong) {
      message.error("Please fill in all required fields.");
      return; 
    }
    if (isDefault) {
      await updateAddressToRemoveDefault();
    }
  
    const address = {
      city: selectedTinh,
      district: selectedQuan,
      ward: selectedPhuong,
      street,
      fullName,
      phone,
      type,
      default: isDefault,
      user: { userID: user.userID },
    };
  
    try {
      const result = await updateAddress(initialData.addressID, address);
      if (result) {
        message.success("Address updated successfully!");
        onSubmit(address);
      } else {
        message.error("Failed to update address.");
      }
    } catch (error) {
      message.error("An error occurred while updating the address.");
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Select
        placeholder="Tỉnh"
        value={selectedTinh}
        onChange={(value) => {
          setSelectedTinh(value);
        }}
      >
        {tinhList.map((item) => (
          <Select.Option key={item.id} value={item.full_name}>
            {item.full_name}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Quận/Huyện"
        value={selectedQuan}
        onChange={(value) => {
          setSelectedQuan(value);
        }}
      >
        {quanList.map((item) => (
          <Select.Option key={item.id} value={item.full_name}>
            {item.full_name}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Phường/Xã"
        value={selectedPhuong}
        onChange={(value) => {
          setSelectedPhuong(value);
        }}
      >
        {phuongList.map((item) => (
          <Select.Option key={item.id} value={item.full_name}>
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
      <Button type="primary" onClick={handleUpdateAddress}>Update Address</Button>
    </div>
  );
};

export default AddressEditForm;