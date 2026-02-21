import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));

const file = "src/components/Footer.tsx";
const content = readFileSync(file, "utf8");
writeFileSync(file, content.replace(/v\d+\.\d+\.\d+/, `v${version}`));
execSync(`git add ${file}`);
