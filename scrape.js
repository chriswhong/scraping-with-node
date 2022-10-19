import fs from "fs";
import fetch from "node-fetch";
import cheerio from "cheerio";

(async () => {
  const url =
    "https://www1.nyc.gov/html/dot/html/about/current-projects.shtml#brooklyn";
  const html = await fetch(url).then((d) => d.text());

  const $ = cheerio.load(html);

  const boroughs = $(".view-content h2");

  let csvString = "borough,project_name,project_description\n";

  boroughs.each((i, borough) => {
    const boroughText = $(borough).text();
    const projects = $(borough).nextUntil("h2");
    projects.each((i, project) => {
      const projectTitle = $(project).find("h3").text();

      const projectDescription = $(project).find("p").text();

      csvString += `${boroughText},"${projectTitle}","${projectDescription}"\n`;
    });
  });

  console.log(csvString);
  fs.writeFileSync("./dot-projects.csv", csvString);
})();
