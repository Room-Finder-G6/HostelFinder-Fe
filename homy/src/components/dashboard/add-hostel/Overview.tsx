import NiceSelect from "@/ui/NiceSelect";

const Overview = () => {

   const selectHandler = (e: any) => { };

   return (
      <div className="bg-white card-box border-20">
         <h4 className="dash-title-three">Overview</h4>
         <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Name Hostel*</label>
            <input type="text" placeholder="Your Hostel Name" />
         </div>
         <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Description*</label>
            <textarea className="size-lg" placeholder="Write about property..."></textarea>
         </div>
         <div className="row align-items-end">
            <div className="col-md-6">
               <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Category*</label>
                  <NiceSelect className="nice-select"
                     options={[
                        { value: "1", text: "Apartments" },
                        { value: "2", text: "Hostel" },
                        { value: "3", text: "Houses" },
                      
                     ]}
                     defaultCurrent={0}
                     onChange={selectHandler}
                     name=""
                     placeholder="" />
               </div>
            </div>
            <div className="col-md-6">
               <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Listed in*</label>
                  <NiceSelect className="nice-select"
                     options={[
                        { value: "1", text: "All Listing" },
                        { value: "2", text: "Buy" },
                        { value: "3", text: "Sell" },
                        { value: "4", text: "Rent" },
                     ]}
                     defaultCurrent={0}
                     onChange={selectHandler}
                     name=""
                     placeholder="" />
               </div>
            </div>
            <div className="col-md-6">
               <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Giá*</label>
                  <input type="text" placeholder="Your Price" />
               </div>
            </div>
            <div className="col-md-6">
               <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Tên chủ trọ*</label>
                  <input type="text" placeholder="" />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Overview;
