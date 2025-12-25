import { Container } from "react-bootstrap";
import CDNImage from "../common/CDNImage";
import { FiPlus } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

const Header = () => {

  return (
    <>
      <header>
        <Container fluid>
          <div className="top-nav">
            <div className="burger-logo-wrap">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" fill="#fff" viewBox="0 0 24 24" width="24" aria-hidden="true" styles="pointer-events:none;display:inherit;width:100%;height:100%"><path d="M20 5H4a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2m0 6H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2m0 6H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2" /></svg>
              </span>
              <CDNImage imgSrc="/media/images/common/youtube.svg" imgAlt="YouTube Logo" imgClass="object-fit-contain w-100 h-100" className="logo-image-wrapper" />
            </div>
            <div className="search-wrap">
              <input type="text" placeholder="Search" />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
            <div className="profile">
              <div className="create-wrap">
                <span>
                  <FiPlus />
                </span>
                <p>Create</p>
              </div>
              <span className="notification-wrap">
                <IoNotificationsOutline />
              </span>
              <CDNImage imgSrc="/media/images/common/prifole.jpg" imgAlt="User Avatar" imgClass="object-fit-cover w-100 h-100" className="avatar-image-wrapper" />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;