import Image from "next/image";
import deleteIcon from "@/assets/images/dashboard/icon/icon_22.svg";

interface DeleteModalProps {
   show: boolean;
   title: string;
   message: string;
   onConfirm: () => void;
   onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, title, message, onConfirm, onCancel }) => {
   return (
       <>
          {show && (
              <div className="modal fade show" tabIndex={-1} aria-hidden="true" style={{ display: 'block' }}>
                 <div className="modal-dialog modal-dialog-centered">
                    <div className="container modal-content">
                       <div className="remove-account-popup text-center ">
                          <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
                          <Image src={deleteIcon} alt="" className="lazy-img m-auto" />
                          <h2>{title}</h2>
                          <p>{message}</p>
                          <div className="button-group d-inline-flex justify-content-center align-items-center pt-15">
                             <button className="confirm-btn fw-500 tran3s me-3" onClick={onConfirm}>Yes</button>
                             <button type="button" className="btn-close fw-500 ms-3" onClick={onCancel}>Cancel</button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
          )}
       </>
   );
};

export default DeleteModal;