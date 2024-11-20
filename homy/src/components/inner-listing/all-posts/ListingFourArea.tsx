"use client";
import React, {useEffect, useState} from "react";
import DropdownTwo from "@/components/search-dropdown/inner-dropdown/DropdownTwo";
import apiInstance from "@/utils/apiInstance";
import { FilterPostData } from "@/models/filterPostData";
import Loading from "@/components/Loading";

const ListingFourArea = () => {
   const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [filterData, setFilterData] = useState<FilterPostData>({
      province: "",
      district: "",
      commune: "",
      minSize: 0,
      maxSize: 999,
      minPrice: 0,
      maxPrice: 9999999
   });

   const handleSearch = async () => {
      setIsLoading(true);
      try {
         const response = await apiInstance.post("posts/filter", filterData);
         if (response.status === 200) {
            setFilteredPosts(response.data.data);
            console.log("Filtered posts:", response.data.data);
         } else {
            console.error("Failed to filter posts");
         }
      } catch (error) {
         console.error("Error fetching filtered posts:", error);
      } finally {
         setIsLoading(false);
      }
   };

    useEffect(() => {
        handleSearch();
    }, []);

   const handleFilterChange = (newFilterData: FilterPostData) => {
      setFilterData(newFilterData);
   };

   return (
       <div className="property-listing-six bg-pink-two pt-110 md-pt-80 pb-170 xl-pb-120 mt-150 xl-mt-120">
          <div className="container">
             <div className="search-wrapper-one layout-one bg position-relative mb-75 md-mb-50">
                <div className="bg-wrapper border-layout">
                   <DropdownTwo
                       filterData={filterData}
                       onFilterChange={handleFilterChange}
                       onSearch={handleSearch}
                   />
                </div>
             </div>

             {/* Hiển thị Loading khi đang tải */}
             {isLoading ? (
                 <Loading />
             ) : (
                 <div>
                    {filteredPosts.map((item: any) => (
                        <div key={item.id}>
                           <h3>{item.title}</h3>
                           <p>{item.address.province}</p>
                        </div>
                    ))}
                 </div>
             )}
          </div>
       </div>
   );
};

export default ListingFourArea;
