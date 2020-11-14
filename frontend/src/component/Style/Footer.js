import React from "react";
import "./Footer.css";
import authService from "../../Services/AuthService";

const Footer = () => {
  const user = authService.getCurrentUser();

  if (user !== null) {
    switch (user.user.userTypeId) {
      case 1:
        return (
          <footer className="page-footer font-small bg-info">
            <div className="footer-copyright text-center py-3 text-white">
              © 2020 Copyright: BookEat
            </div>
          </footer>
        );

      case 2:
        return (
          <footer className="page-footer font-small bg-danger">
            <div className="footer-copyright text-center py-3">
              © 2020 Copyright: BookEat
            </div>
          </footer>
        );

      case 3:
        return (
          <footer className="page-footer font-small bg-danger">
            <div className="footer-copyright text-center py-3">
              © 2020 Copyright: BookEat
            </div>
          </footer>
        );

      default:
        return (
          <footer className="page-footer font-small bg-dark">
            <div className="footer-copyright text-center py-3 text-light">
              © 2020 Copyright: BookEat
            </div>
          </footer>
        );
    }
  } else {
    return (
      <footer className="page-footer font-small bg-dark">
        <div className="footer-copyright text-center py-3 text-light">
          © 2020 Copyright: BookEat
        </div>
      </footer>
    );
  }
};

export default Footer;
