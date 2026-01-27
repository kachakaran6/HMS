import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Department from "../components/Department";
import MessageForm from "../components/MessageForm";

const Home = () => {
  return (
    <main>
      <Hero title="Welcome to a Healthcare Provider" imageurl="/hero.png" />
      <Biography imageurl="/about.png" />
      <Department />
      <MessageForm />
    </main>
  );
};

export default Home;
