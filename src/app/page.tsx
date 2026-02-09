import Hero from "@/components/ui/Hero"
import Services from "@/components/ui/Services"
import fs from "fs/promises"
import path from "path";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src/content/message.json")
  const raw = await fs.readFile(filePath, "utf8")
  const data = JSON.parse(raw)
  console.log(data)
  return (
    <section className="section-full">
      <p>{data.text}</p>
     <Hero />
     <section>
      <Services/>
     </section>
    </section>
  );
}
