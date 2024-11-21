import NiceSelect from "@/ui/NiceSelect";
import React, {useEffect, useState} from "react";
import {FilterPostData} from "@/models/filterPostData";

interface DropdownTwoProps {
    filterData: FilterPostData;
    onFilterChange: (filterData: FilterPostData) => void;
    onSearch: () => void;
}

const DropdownTwo = ({filterData, onFilterChange, onSearch}: DropdownTwoProps) => {
    const [provinces, setProvinces] = useState<{ value: string; text: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; text: string }[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api");
                const data = await response.json();
                const formattedProvinces = data.map((province: any) => ({
                    value: province.code,
                    text: province.name,
                }));
                setProvinces(formattedProvinces);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };

        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProvince = provinces.find((p) => p.value === e.target.value);
        onFilterChange({
            ...filterData,
            province: selectedProvince?.text || "",
            district: "",
        });

        try {
            const response = await fetch(
                `https://provinces.open-api.vn/api/p/${e.target.value}?depth=2`
            );
            const data = await response.json();
            const formattedDistricts = data.districts.map((district: any) => ({
                value: district.code,
                text: district.name,
            }));
            setDistricts(formattedDistricts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDistrict = districts.find((d) => d.value === e.target.value);
        onFilterChange({
            ...filterData,
            district: selectedDistrict?.text || "",
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        onFilterChange({
            ...filterData,
            minPrice: value === 0 ? 0 : value === 1 ? 10000 : value === 2 ? 20000 : 30000,
            maxPrice: value === 0 ? 0 : value === 1 ? 200000 : value === 2 ? 300000 : 400000,
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onFilterChange({
            ...filterData,
            minSize: value === "1" ? 20 : value === "2" ? 30 : value === "3" ? 50 : 0,
            maxSize: value === "1" ? 30 : value === "2" ? 50 : value === "3" ? 100 : 0,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ngăn form tải lại trang
        onSearch(); // Gọi API search
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row gx-0 align-items-center">
                <div className="col-xl-2 col-lg-3">
                    <div className="input-box-one border-left">
                        <div className="label">Chọn tỉnh/thành phố</div>
                        <NiceSelect
                            className="nice-select location"
                            options={provinces}
                            defaultCurrent={0}
                            onChange={handleProvinceChange}
                            name="province"
                            placeholder="Tỉnh/thành phố"
                        />
                    </div>
                </div>

                <div className="col-xl-2 col-lg-3">
                    <div className="input-box-one border-left">
                        <div className="label">Chọn quận/huyện</div>
                        <NiceSelect
                            className="nice-select location"
                            options={districts}
                            onChange={handleDistrictChange}
                            name="district"
                            placeholder="Quận/huyện"
                        />
                    </div>
                </div>

                <div className="col-xl-3 col-lg-4">
                    <div className="input-box-one border-left border-lg-0">
                        <div className="label">Mức giá</div>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "0", text: "Tất cả mức giá"},
                                {value: "1", text: "$10,000 - $200,000"},
                                {value: "2", text: "$20,000 - $300,000"},
                                {value: "3", text: "$30,000 - $400,000"},
                            ]}
                            onChange={handlePriceChange}
                            name="price"
                            currentValue={
                                filterData.minPrice === 10000 ? "1" :
                                    filterData.minPrice === 20000 ? "2" :
                                        filterData.minPrice === 30000 ? "3" : "0"
                            }
                            placeholder="Mức giá"
                        />

                    </div>
                </div>

                <div className="col-xl-2 col-lg-3">
                    <div className="input-box-one border-left border-lg-0">
                        <div className="label">Diện tích</div>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "0", text: "Tất cả diện tích"},
                                {value: "1", text: "20 - 30 m²"},
                                {value: "2", text: "30 - 50 m²"},
                                {value: "3", text: "50 - 100 m²"},
                            ]}
                            onChange={handleSizeChange}
                            name="size"
                            currentValue={
                                filterData.minSize === 20 ? "1" :
                                    filterData.minSize === 30 ? "2" : "3"
                            }
                            placeholder="Diện tích"
                        />
                    </div>
                </div>

                <div className="col-xl-2">
                    <div className="input-box-one lg-mt-20">
                        <div className="d-flex align-items-center">
                            <button
                                type="submit" // Đảm bảo đây là submit button
                                className="fw-500 text-uppercase tran3s search-btn"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DropdownTwo;
