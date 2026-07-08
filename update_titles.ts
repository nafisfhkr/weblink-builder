import { prisma } from "./lib/prisma";

async function main() {
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    try {
      let blocks = [];
      if (typeof proj.blocksData === 'string') {
        blocks = JSON.parse(proj.blocksData);
      } else {
        blocks = proj.blocksData as any[];
      }
      
      const heading = blocks.find((b: any) => b.type === 'heading');
      if (heading && heading.content && heading.content.title) {
        await prisma.project.update({
          where: { id: proj.id },
          data: { title: heading.content.title }
        });
        console.log(`Updated project ${proj.id} title to: ${heading.content.title}`);
      }
    } catch (e) {
      console.log(`Skipping project ${proj.id} due to parse error`);
    }
  }
}

main().finally(() => prisma.$disconnect());
