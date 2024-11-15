import {Service} from "@/models/service";

interface CommonPropertyFeatureListProps {
    services: Service[];
}

const CommonPropertyFeatureList = ({services}: CommonPropertyFeatureListProps) => {
    return (
        <div className="accordion" id="accordionTwo">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                        Các dịch vụ chung của nhà trọ
                    </button>
                </h2>
                <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#accordionTwo">
                    <div className="accordion-body">
                        <div className="feature-list-two">
                            <ul className="style-none d-flex flex-wrap justify-content-between list-style-one">
                                {services.map((service) => (
                                    <li key={service.id}>
                                        <span>{service.serviceName}</span>
                                        <span className="fw-500 color-dark">{service.price}</span>
                                    </li>))}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonPropertyFeatureList;