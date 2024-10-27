interface UserAvatarSettingProps {
   username: string;
   email: string;
   phone: string;
   about: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UserAvatarSetting: React.FC<UserAvatarSettingProps> = ({ username, email, phone, onChange }) => {
   console.log("UserAvatarSetting props:", { username, email, phone }); // Log để kiểm tra dữ liệu truyền vào

   return (
       <div className="row">
           <div className="col-sm-6">
               <div className="dash-input-wrapper mb-30">
                   <label htmlFor="username">Username*</label>
                   <input
                       type="text"
                       name="username"
                       value={username}
                       onChange={onChange}
                       placeholder="Enter your username"
                   />
               </div>
           </div>
           <div className="col-sm-6">
               <div className="dash-input-wrapper mb-30">
                   <label htmlFor="email">Email*</label>
                   <input
                       type="email"
                       name="email"
                       value={email}
                       onChange={onChange}
                       placeholder="Enter your email"
                   />
               </div>
           </div>
           <div className="col-sm-6">
               <div className="dash-input-wrapper mb-30">
                   <label htmlFor="phone">Phone Number*</label>
                   <input
                       type="tel"
                       name="phone"
                       value={phone}
                       onChange={onChange}
                       placeholder="Enter your phone number"
                   />
               </div>
           </div>
        
       </div>
   );
};

export default UserAvatarSetting;
