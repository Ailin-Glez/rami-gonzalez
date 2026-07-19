import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const Tickets = lazy(() => import("./components/Tickets"));
const YouTubeSection = lazy(() => import("./components/YouTubeSection"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const About = lazy(() => import("./components/About"));

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Tickets />
        </Suspense>
        <Suspense fallback={null}>
          <YouTubeSection />
        </Suspense>
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
        <Suspense fallback={null}>
          <About />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
