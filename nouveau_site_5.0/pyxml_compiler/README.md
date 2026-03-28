# PyXML Compiler

PyXML is a lightweight, declarative template engine that compiles XML-like structures into clean, accessible HTML. It is designed to separate data, structure, and style while maintaining a highly readable project organization.

## Project Status

This project is currently in active development. It was born from the need for a simple, data-driven personal website builder that prioritizes performance and aesthetics.

> [!NOTE]
> The author intends to distribute this compiler as an **open-source project** in the future. Stay tuned for updates on its independent release.

## Core Features

- **Component-based architecture**: define reusable UI components as XML files.
- **Data-driven loops**: automatically generate pages or list items from YAML, JSON, or Markdown sources.
- **Multilingual Support**: built-in attributes for smooth translation and language-specific visibility.
- **Static & Dynamic Generation**: compile fixed pages or sets of pages from data manifests.

## How it works

1. **Source**: Write your pages in `.xml` using PyXML tags.
2. **Data**: Prepare your content in YAML, JSON, or Markdown.
3. **Compile**: The Python-based compiler processes the templates, injects the data, and outputs production-ready HTML.
