---
title_en: "Building My Own PyXML Compiler"
title_fr: "Construire Mon Propre Compilateur PyXML"
date: "2026-03-27"
author: "Nathan Cerisara"
image: "res/logo.svg"
tags: ["Python", "Static Site Generator", "Compilers"]
summary_en: "A deep dive into why and how I built a custom XML-based static site generator for my portfolio."
summary_fr: "Une exploration profonde sur pourquoi et comment j'ai construit un générateur de site statique personnalisé basé sur XML."
---

### Why PyXML?
Standard SSGs like Jekyll or Hugo use Markdown + YAML Frontmatter. While powerful, they often feel disconnected from the HTML structure. PyXML allows me to define **custom semantic tags** that map directly to high-level UI components.

### Implementation Details
- **Parser**: Uses Python's `xml.etree.ElementTree` with custom extensions for execution blocks (`exec_*`).
- **Context**: A robust state manager for variable resolution and pathing.
- **Glassmorphism**: Native support for CSS backdrop filters.

### Future Improvements
- **Live Preview**: Integrated dev server with hot reload.
- **Wasm Version**: Running the compiler in the browser.
