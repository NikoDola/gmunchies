import Hero from "@/components/Hero"
import Services from "@/components/Services"
import fs from "fs/promises"
import path from "path";
import Results from "@/components/Results";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src/content/message.json")
  const raw = await fs.readFile(filePath, "utf8")
  const data = JSON.parse(raw)
  console.log(data)
  return (
    <main>
      <Hero />
      <Services/>
      <Results />
    </main>
  );
}
