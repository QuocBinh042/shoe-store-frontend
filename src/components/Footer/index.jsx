import React from "react";
import "./Footer.scss"; // Import SCSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Newsletter Section */}
        <div className="footer__row">
          <div className="footer__newsletter">
            <h5 className="footer__newsletter-title">Newsletter</h5>
            <p className="footer__newsletter-text">
              Sign up for newsletter to receive special offers and exclusive news about binova products
            </p>
            <form className="footer__form">
              <input
                type="email"
                className="footer__form-input"
                placeholder="Enter your email"
                required
              />
              <button type="submit" className="footer__form-button">
                Subscribe
              </button>
            </form>
          </div>

          {/* Contact and Links */}
          <div className="footer__contact">
            <h5 className="footer__title">Nhom 5</h5>
            <p className="footer__text">Call Customer Service, We Support 24/7:</p>
            <p className="footer__highlight">84-0123-456-789</p>
            <p className="footer__text">Address:</p>
            <p className="footer__address">PO Box 1622 Vissaosang Street West</p>
            <div className="footer__social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
              <a href="#"><i className="fab fa-vimeo-v"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Customer Service and About Us */}
          <div className="footer__links">
            <h5 className="footer__title">Customer Service</h5>
            <a href="#">Contact us</a>
            <a href="#">Help and advice</a>
            <a href="#">Shipping & Returns</a>
            <a href="#">Terms and conditions</a>
            <a href="#">Refund Policy</a>

            <h5 className="footer__title">About Us</h5>
            <a href="#">Who We Are?</a>
            <a href="#">Corporate Responsibility</a>
            <a href="#">California Laws</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>

        {/* Copyright and Payment Methods */}
        <div className="footer__row">
          <hr className="footer__divider" />
          <div className="footer__bottom">
            <p className="footer__copyright">
              Copyright © 2019 Vinovathemes. All rights reserved.
            </p>
            <div className="footer__payment-methods">
              <img src="https://via.placeholder.com/40x25.png?text=AMEX" alt="American Express" />
              <img src="https://via.placeholder.com/40x25.png?text=Visa" alt="Visa" />
              <img src="https://via.placeholder.com/40x25.png?text=MasterCard" alt="MasterCard" />
              <img src="https://via.placeholder.com/40x25.png?text=PayPal" alt="PayPal" />
              <img src="https://via.placeholder.com/40x25.png?text=DBS" alt="DBS" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
