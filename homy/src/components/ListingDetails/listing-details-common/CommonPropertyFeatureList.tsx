interface CommonPropertyFeatureListProps {
   bedRooms: number;
   bathRooms: number;
   kitchen: number;
   size: number;
   status: boolean;
}

const CommonPropertyFeatureList = ({ bedRooms, bathRooms, kitchen, size, status }: CommonPropertyFeatureListProps) => {
   return (
       <div className="accordion" id="accordionTwo">
          <div className="accordion-item">
             <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                   Property Features
                </button>
             </h2>
             <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#accordionTwo">
                <div className="accordion-body">
                   <div className="feature-list-two">
                      <ul className="style-none d-flex flex-wrap justify-content-between">
                         <li><span>Bedrooms: </span> <span className="fw-500 color-dark">{bedRooms}</span></li>
                         <li><span>Bathrooms: </span> <span className="fw-500 color-dark">{bathRooms}</span></li>
                         <li><span>Kitchen: </span> <span className="fw-500 color-dark">{kitchen}</span></li>
                         <li><span>Size: </span> <span className="fw-500 color-dark">{size} m²</span></li>
                         <li><span>Status: </span> <span className="fw-500 color-dark">{status ? "Available" : "Not Available"}</span></li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
       </div>
   );
};

export default CommonPropertyFeatureList;