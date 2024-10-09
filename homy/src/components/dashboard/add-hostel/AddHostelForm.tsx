"use client";
import React, { useState, useEffect } from "react";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
interface CustomJwtPayload  {
<<<<<<< HEAD
  // landlordId : string;
=======
  landlordId : string;
>>>>>>> 01f96cc83d59399076b8de078abb323531c4285b
  UserId : string;
}

interface Address {
  province: string;
  district: string;
  commune: string;
  detailAddress: string;
}

interface FormData {
  landlordId: string;
  hostelName: string;
  description: string;
  address: Address;
  size: number | string;
  numberOfRooms: number | string;
}

const AddHostelForm: React.FC = () => {
  const [provinces, setProvinces] = useState<{ value: number; text: string }[]>([]);
  const [districts, setDistricts] = useState<{ value: number; text: string }[]>([]);
  const [communes, setCommunes] = useState<{ value: number; text: string }[]>([]);

  const [formData, setFormData] = useState<FormData>({
    landlordId: "",
    hostelName: "",
    description: "",
    address: {
      province: "",
      district: "",
      commune: "",
      detailAddress: "",
    },
    size: "",
    numberOfRooms: "",
  });

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust key based on how you store the token
    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        console.log(decodedToken);
        console.log(decodedToken.UserId);
        // If landlordId exists, update the formData
        if (decodedToken.UserId) {
          setFormData((prevData) => ({
            ...prevData,
            landlordId: decodedToken.UserId,
          }));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchCommunes(selectedDistrict);
    }
  }, [selectedDistrict]);

  const fetchProvinces = async () => {
    const response = await fetch("https://provinces.open-api.vn/api/p");
    const data = await response.json();
    setProvinces(
      data.map((province: any) => ({
        value: province.code,
        text: province.name,
      }))
    );
  };

  const fetchDistricts = async (provinceCode: number) => {
    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    const data = await response.json();
    setDistricts(
      data.districts.map((district: any) => ({
        value: district.code,
        text: district.name,
      }))
    );
  };

  const fetchCommunes = async (districtCode: number) => {
    const response = await fetch(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    const data = await response.json();
    setCommunes(
      data.wards.map((ward: any) => ({
        value: ward.code,
        text: ward.name,
      }))
    );
  };

  const selectProvinceHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = parseInt(e.target.value);
    const province = provinces.find((p) => p.value === provinceCode);
    setSelectedProvince(provinceCode);
    setFormData({
      ...formData,
      address: { ...formData.address, province: province?.text || "" },
    });
    setSelectedDistrict(null);
    setCommunes([]);
  };

  const selectDistrictHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = parseInt(e.target.value);
    const district = districts.find((d) => d.value === districtCode);
    setSelectedDistrict(districtCode);
    setFormData({
      ...formData,
      address: { ...formData.address, district: district?.text || "" },
    });
  };

  const selectCommuneHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communeCode = parseInt(e.target.value);
    const commune = communes.find((c) => c.value === communeCode);
    setFormData({
      ...formData,
      address: { ...formData.address, commune: commune?.text || "" },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "size" || name === "numberOfRooms") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "detailAddress") {
      setFormData({
        ...formData,
        address: { ...formData.address, detailAddress: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiInstance.post("/hostels", formData);
      if (response.status === 200 && response.data.succeeded) {
        const { message } = response.data;
        toast.success(message, { position: "top-center" });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else {
        toast.error("Something went wrong", { position: "top-center" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white card-box border-20">
        <h4 className="dash-title-three">Thêm mới phòng trọ</h4>

        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Tên nhà trọ*</label>
          <input
            type="text"
            placeholder="Nhập tên phòng trọ"
            name="hostelName"
            value={formData.hostelName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Chi tiết*</label>
          <textarea
            className="size-lg"
            placeholder="Hãy viết miêu tả chi tiết về phòng trọ..."
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="row align-items-end">
          <div className="col-md-4">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Tỉnh/Thành phố*</label>
              <NiceSelect
                className="nice-select"
                options={provinces}
                onChange={selectProvinceHandler}
                placeholder="Chọn Tỉnh/Thành phố"
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Quận/Huyện*</label>
              <NiceSelect
                className="nice-select"
                options={districts}
                onChange={selectDistrictHandler}
                placeholder="Chọn Quận/Huyện"
                disabled={!selectedProvince}
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Xã/Phường*</label>
              <NiceSelect
                className="nice-select"
                options={communes}
                onChange={selectCommuneHandler}
                placeholder="Chọn Xã/Phường"
                disabled={!selectedDistrict}
                required
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Địa chỉ cụ thể*</label>
              <input
                type="text"
                placeholder="Địa chỉ cụ thể"
                name="detailAddress"
                value={formData.address.detailAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Diện tích*</label>
              <input
                type="text"
                placeholder="Diện tích phòng trọ"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Số lượng phòng*</label>
              <input
                type="number"
                placeholder="Số lượng phòng"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="button-group d-inline-flex align-items-center mt-30">
          <button type="submit" className="dash-btn-two tran3s me-3">
            Lưu
          </button>
          <button className="dash-cancel-btn tran3s" type="submit">
            Thoát
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddHostelForm;
