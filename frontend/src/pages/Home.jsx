import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Department from "../components/Department";
import MessageForm from "../components/MessageForm";

const Home = () => {
  return (
    <>
      <Hero
        title={"Welcome to a health care provider"}
        imageurl={"/hero.png"}
      />
      <Biography imageurl={"/about.png"} />
      <Department />
      <MessageForm />
    </>
  );
};

export default Home;
