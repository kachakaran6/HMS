import React from "react";

const Hero = ({ title, imageurl }) => {
  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laborum
          aliquam eligendi rerum cumque, a impedit est beatae. Cupiditate,
          repellendus veniam! Dolor, autem. Cumque labore ea similique
          voluptates ullam fugiat quasi possimus. Voluptas debitis explicabo
          fuga deserunt laboriosam aliquam commodi iste libero natus non. Eaque,
          inventore facere. Praesentium, neque blanditiis!
        </p>
      </div>
      <div className="banner">
        <img src={imageurl} alt="hero" className="animated-image" />
        <span>
          <img src="/Vector.png" alt="vector" />
        </span>
      </div>
    </div>
  );
};

export default Hero;
