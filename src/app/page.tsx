import Hero from "@/components/Hero"
import Services from "@/components/Services"
import fs from "fs/promises"
import path from "path";
import Results from "@/components/Results";
import Form from "@/components/ui/Form";
import Testomonials from "@/components/Testemonials";
import Locations from "@/components/Locations";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src/content/message.json")
  const raw = await fs.readFile(filePath, "utf8")
  const data = JSON.parse(raw)
  console.log(data)
  return (
    <main>
      <Hero />
      <Services/>
      <Locations />
      <Results />
      <Testomonials />
      <Form />
    </main>
  );
}
