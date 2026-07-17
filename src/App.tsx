import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import YouTubeSection from "./components/YouTubeSection";
import Tickets from "./components/Tickets";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Tickets />
        <YouTubeSection />
        <ContactForm />
        <About />
      </main>
      <Footer />
    </>
  );
}

export default App;
