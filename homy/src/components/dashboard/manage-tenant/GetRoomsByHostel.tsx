import React, { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";

const GetRoomsByHostel = ({ hostelId }: { hostelId: string }) => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await apiInstance.get(`/rooms/hostels/${hostelId}`);
      setRooms(response.data);
    };

    fetchRooms();
  }, [hostelId]);

  return rooms;
};

export default GetRoomsByHostel;
