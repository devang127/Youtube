import React from "react";
import { useNavigate } from "react-router-dom";

const PrimaryButton = ({ text, to, className, type = "button", ...props }) => {
  const navigate = useNavigate();

  const handleClick = e => {
    if (props.onClick) {
      props.onClick(e);
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <button type={type} className={`primary-btn ${className || ""}`} {...props} onClick={handleClick}>
      <span className="text">{text}</span>
      <span className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
          <path
            d="M11 4.99593C10.9962 4.55719 10.8296 4.13772 10.5364 3.82842L7.16571 0.242502C7.0185 0.0871811 6.81936 0 6.61179 0C6.40421 0 6.20507 0.0871811 6.05786 0.242502C5.98421 0.320027 5.92576 0.412261 5.88587 0.513884C5.84598 0.615506 5.82544 0.724506 5.82544 0.834595C5.82544 0.944685 5.84598 1.05368 5.88587 1.15531C5.92576 1.25693 5.98421 1.34916 6.05786 1.42669L8.64286 4.16199H0.785714C0.57733 4.16199 0.377481 4.24985 0.230131 4.40625C0.0827805 4.56264 0 4.77475 0 4.99593C0 5.2171 0.0827805 5.42921 0.230131 5.58561C0.377481 5.742 0.57733 5.82986 0.785714 5.82986H8.64286L6.05786 8.5735C5.9099 8.72943 5.82637 8.94135 5.82563 9.16265C5.8249 9.38394 5.90702 9.59649 6.05393 9.75352C6.20084 9.91055 6.40051 9.99921 6.60901 10C6.81751 10.0008 7.01776 9.91362 7.16571 9.75769L10.5364 6.17177C10.8315 5.86042 10.9982 5.43756 11 4.99593Z"
            fill="white"
          />
        </svg>
      </span>
    </button>
  );
};

export default PrimaryButton;