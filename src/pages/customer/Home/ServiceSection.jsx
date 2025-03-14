import React from "react";

const services = [
  {
    icon: "🚀",
    title: "EXPRESS SHIPPING",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque",
  },
  {
    icon: "🛡️",
    title: "PAYMENT SECURED",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque",
  },
  {
    icon: "💰",
    title: "MONEY BACK GUARANTEE",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque",
  },
  {
    icon: "🎧",
    title: "24/7 HELP CENTER",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque",
  },
];

const ServiceSection = () => {
  return (
    <div className="service-section">
      <div className="service-container">
        {services.map((service, index) => (
          <div key={index} className="service-box">
            <div className="service-icon">{service.icon}</div>
            <div className="service-title">{service.title}</div>
            <div className="service-description">{service.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
