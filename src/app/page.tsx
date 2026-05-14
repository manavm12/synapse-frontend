import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { NeuralBackground } from "@/components/neural-background";

export default function Home() {
  return (
    <>
      <NeuralBackground />
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
