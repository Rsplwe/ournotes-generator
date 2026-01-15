import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import OurNotesGenerator from "./our-notes-generator.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OurNotesGenerator />
  </StrictMode>
)
