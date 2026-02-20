import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.BASE_PATH ?? (repoName ? `/${repoName}/` : "/");

export default defineConfig({
  plugins: [react()],
  base,
});
