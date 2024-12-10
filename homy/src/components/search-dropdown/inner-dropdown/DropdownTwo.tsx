import NiceSelect from "@/ui/NiceSelect";
import React, { useEffect, useState } from "react";
import { FilterPostData } from "@/models/filterPostData";

interface DropdownTwoProps {
    filterData: FilterPostData;
    onFilterChange: (filterData: FilterPostData) => void;
    onSearch: () => void;
}

interface PriceRange {
    min: number;
    max: number | null; // Thêm null để đại diện cho không giới hạn;
}

interface SizeRange {
    min: number
    max: number | null; // Thêm null để đại diện cho không giới hạn
}

const PRICE_RANGES: Record<string, PriceRange> = {
    "0": { min: 0, max: Number.MAX_SAFE_INTEGER }, // Tất cả mức giá
    "1": { min: 0, max: 2000000 },
    "2": { min: 2000000, max: 4000000 },
    "3": { min: 4000000, max: 6000000 },
    "4": { min: 6000000, max: 10000000 },
    "5": { min: 10000000, max: null }
};

const SIZE_RANGES: Record<string, SizeRange> = {
    "0": { min: 0, max: Number.MAX_SAFE_INTEGER }, // Tất cả diện tích
    "1": { min: 0, max: 29.99 },
    "2": { min: 30, max: 50 },
    "3": { min: 50, max: 80 },
    "4": { min: 80, max: 100 },
    "5": { min: 100.01, max: null } // max = null nghĩa là không giới hạn
};

const PRICE_OPTIONS = [
    { value: "0", text: "Tất cả mức giá" },
    { value: "1", text: "Dưới 2.000.000đ" },
    { value: "2", text: "Từ 2.000.000đ - 4.000.000" },
    { value: "3", text: "Từ 4.000.000đ - 6.000.000" },
    { value: "4", text: "Từ 6.000.000đ - 10.000.000" },
    { value: "5", text: "Từ 10.000.000đ" }
];

const SIZE_OPTIONS = [
    { value: "0", text: "Tất cả diện tích" },
    { value: "1", text: "Dưới 30 m²" },
    { value: "2", text: "30 - 50 m²" },
    { value: "3", text: "50 - 80 m²" },
    { value: "4", text: "80 - 100 m²" },
    { value: "5", text: "Lớn hơn 100 m²" }
];

const DropdownTwo = ({ filterData, onFilterChange, onSearch }: DropdownTwoProps) => {
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
            province: selectedProvince?.text ?? "",
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
        const selectedRange = PRICE_RANGES[e.target.value];
        onFilterChange({
            ...filterData,
            minPrice: selectedRange.min,
            maxPrice: selectedRange.max ?? Number.MAX_SAFE_INTEGER, // Sử dụng MAX_SAFE_INTEGER khi max là null
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRange = SIZE_RANGES[e.target.value];
        onFilterChange({
            ...filterData,
            minSize: selectedRange.min,
            maxSize: selectedRange.max ?? Number.MAX_SAFE_INTEGER, // Sử dụng MAX_SAFE_INTEGER khi max là null
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row gx-0 align-items-center">
                <div className="col-xl-3 col-lg-4">
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
                            options={PRICE_OPTIONS}
                            onChange={handlePriceChange}
                            name="price"
                            placeholder="Mức giá"
                        />
                    </div>
                </div>

                <div className="col-xl-2 col-lg-3">
                    <div className="input-box-one border-left border-lg-0">
                        <div className="label">Diện tích</div>
                        <NiceSelect
                            className="nice-select"
                            options={SIZE_OPTIONS}
                            onChange={handleSizeChange}
                            name="size"
                            placeholder="Diện tích"
                        />
                    </div>
                </div>

                <div className="col-xl-2">
                    <div className="input-box-one lg-mt-20">
                        <div className="d-flex align-items-center">
                            <button
                                type="submit"
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