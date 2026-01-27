import Hero from "../components/Hero";
import Biography from "../components/Biography";

const AboutUs = () => {
  return (
    <main>
      <Hero title="About Us" imageurl="/about.png" />
      <Biography imageurl="/whoweare.png" />
    </main>
  );
};

export default AboutUs;
