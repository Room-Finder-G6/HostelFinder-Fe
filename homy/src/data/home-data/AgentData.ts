import { StaticImageData } from "next/image";

import agentThumb_1 from "@/assets/images/agent/img_01.jpg";
import agentThumb_2 from "@/assets/images/agent/img_02.jpg";
import agentThumb_3 from "@/assets/images/agent/img_03.jpg";
import agentThumb_4 from "@/assets/images/agent/img_04.jpg";
import agentThumb_5 from "@/assets/images/agent/img_05.jpg";

interface DataType {
   id: number;
   page: string;
   thumb: StaticImageData;
   title: string;
   desc: string;
}

const agent_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      thumb: agentThumb_1,
      title: "Mai Trọng Hiếu",
      desc: "PM & TechLead",
   },
   {
      id: 2,
      page: "home_1",
      thumb: agentThumb_2,
      title: "Nguyễn Việt Thái",
      desc: "BA & Fullstack Developer",
   },
   {
      id: 3,
      page: "home_1",
      thumb: agentThumb_3,
      title: "Trần Quang Diệu",
      desc: "BA & Test Leader",
   },
   {
      id: 4,
      page: "home_1",
      thumb: agentThumb_4,
      title: "Trần Văn Tùng",
      desc: "Backend Developer & Tester",
   },
   {
      id: 5,
      page: "home_1",
      thumb: agentThumb_5,
      title: "Võ Sỹ Hiếu",
      desc: "Frontend Developer & Tester",
   },
]

export default agent_data;