import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/images/icon/icon_47.svg";
import icon_2 from "@/assets/images/icon/icon_48.svg";
import icon_3 from "@/assets/images/icon/icon_49.svg";
import icon_4 from "@/assets/images/icon/icon_50.svg";
import icon_5 from "@/assets/images/icon/icon_51.svg";

enum RoomType {
    Phòng_trọ = 1,
    Chung_cư = 2,
    Chung_cư_mini = 3,
}

const roomTypeMapping: { [key in RoomType]: string } = {
    [RoomType.Phòng_trọ]: "Phòng trọ",
    [RoomType.Chung_cư]: "Chung cư",
    [RoomType.Chung_cư_mini]: "Chung cư mini",
};

interface DataType {
    id: number;
    icon: StaticImageData;
    title: string;
}

interface CommonPropertyOverviewProps {
    size: number;
    roomType: RoomType;
    bedRooms: number;
}

const CommonPropertyOverview = ({ size, roomType, bedRooms }: CommonPropertyOverviewProps) => {
    const property_overview_data: DataType[] = [
        {
            id: 1,
            icon: icon_1,
            title: `Diện tích: ${size} m²`,
        },
        {
            id: 2,
            icon: icon_2,
            title: `Phòng ngủ: ${bedRooms}`,
        },
        /*{
            id: 3,
            icon: icon_3,
            title: "Bath . 2",
        },
        {
            id: 4,
            icon: icon_4,
            title: "Kitchen . 01",
        },*/
        {
            id: 3,
            icon: icon_5,
            title: `${roomTypeMapping[roomType]}`,
        },
    ];

    return (
        <ul className="style-none d-flex flex-wrap align-items-center justify-content-between">
            {property_overview_data.map((item) => (
                <li key={item.id}>
                    <Image src={item.icon} alt="" className="lazy-img icon" />
                    <span className="fs-20 color-dark">{item.title}</span>
                </li>
            ))}
        </ul>
    );
};

export default CommonPropertyOverview;