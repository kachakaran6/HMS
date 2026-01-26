import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";

const AboutUs = () => {
  return (
    <>
      <Hero title={"About Us"} imageurl={"/about.png"} />
      <Biography imageurl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;
