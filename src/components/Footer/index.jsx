import React from "react";
import "./Footer.scss"; 
import visa from"../../assets/images/logos/visa.png"
import MarterCard from"../../assets/images/logos/masterCard.png"
import PayPal from"../../assets/images/logos/PayPal.png"
import VnPay from"../../assets/images/logos/vnpay_logo.png"
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Newsletter Section */}
        <div className="footer__row">
          <div className="footer__newsletter">
            <h5 className="footer__newsletter-title">Newsletter</h5>
            <p className="footer__newsletter-text">
              Sign up to receive special offers and exclusive news about Binova products
            </p>
            <div className="footer__form">
              <input
                type="email"
                className="footer__form-input"
                placeholder="Enter your email"
                required
              />
              <button type="button" className="footer__form-button">
                Subscribe
              </button>
            </div>
          </div>

          {/* Contact and Links */}
          <div className="footer__contact">
            <h5 className="footer__title">Group 5</h5>
            <p className="footer__text">Customer Support 24/7:</p>
            <p className="footer__highlight">84-0123-456-789</p>
            <p className="footer__text">Address:</p>
            <p className="footer__address">PO Box 1622, Vissaosang West Street</p>
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
            <a href="#">Contact</a>
            <a href="#">Support & Advice</a>
            <a href="#">Shipping & Returns</a>
            <a href="#">Terms & Conditions</a>
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
              Copyright © 2025 Vinovathemes. All rights reserved.
            </p>
            <div className="footer__payment-methods">
              <img src={visa} alt="Visa" />
              <img src={MarterCard} alt="MasterCard" />
              <img src={PayPal} alt="PayPal" />
              <img src={VnPay} alt="VnPay" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;