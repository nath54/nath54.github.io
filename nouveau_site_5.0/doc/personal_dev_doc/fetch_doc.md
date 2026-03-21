# Fetching files from GitHub Pages

The short answer is: **You can fetch almost any file type** from GitHub Pages.

Since GitHub Pages is essentially a static file server, it treats your files like any other web asset. If a file exists in your repository and is published to the site, `fetch()` can grab it.

The real "magic" isn't in what files you can fetch, but in **how you interpret the data** once it arrives.

---

## 1. Common File Types & How to Handle Them

When you use `fetch()`, the response doesn't automatically know how to parse a `.yaml` or `.md` file like it does for `.json()`. You have to tell it how to read the "blob" of data.

| File Extension | Content Type (MIME) | Handling in JS | Use Case |
| :--- | :--- | :--- | :--- |
| **.txt** | `text/plain` | `res.text()` | Simple configuration, logs, or raw strings. |
| **.md** | `text/markdown` | `res.text()` | Loading blog posts or documentation to render via a library like `marked.js`. |
| **.yaml / .yml** | `text/yaml`* | `res.text()` | Configuration files (requires a parser like `js-yaml`). |
| **.csv / .tsv** | `text/csv` | `res.text()` | Small datasets or spreadsheets (requires `PapaParse`). |
| **.svg** | `image/svg+xml` | `res.text()` | Inlining icons directly into your HTML for styling. |
| **.xml** | `application/xml` | `res.text()` | RSS feeds or older API mockups. |
| **Custom** | `application/octet-stream` | `res.text()` or `res.blob()` | Your own formats (e.g., `.mydata`, `.config`). |

> **Note on YAML:** GitHub Pages typically serves `.yaml` as `text/plain` or `application/x-yaml`. Browsers don't have a native `response.yaml()` method, so you'll always fetch it as text and then parse it.

---

## 2. The Implementation Pattern

Here is how you would handle these various "non-JSON" files in vanilla JavaScript:

```javascript
async function loadFile(url) {
  const response = await fetch(url);
  
  // 1. Get the raw text
  const rawData = await response.text();

  // 2. Handle based on extension
  if (url.endsWith('.md')) {
    // Render markdown (using a hypothetical 'marked' library)
    document.body.innerHTML = marked.parse(rawData);
  } else if (url.endsWith('.yaml') || url.endsWith('.yml')) {
    // Parse YAML (using a hypothetical 'jsyaml' library)
    const config = jsyaml.load(rawData);
    console.log(config.site_name);
  } else {
    // Just plain text
    console.log("Raw content:", rawData);
  }
}
```

---

## 3. Important Limitations & Tips

### Custom Extensions

You can name a file `data.pizza` and GitHub Pages will serve it. However, because it doesn't recognize the `.pizza` extension, it will likely serve it with a generic `Content-Type: application/octet-stream`. This doesn't stop `fetch()` from working; you can still use `response.text()` or `response.json()` on it successfully.

### The Jekyll "Trap"

By default, GitHub Pages uses **Jekyll** to build your site. Jekyll ignores any folder or file starting with an underscore (e.g., `_data/`, `_config.yml`).

* **The Fix:** Place a hidden file named `.nojekyll` in the root of your repository. This tells GitHub to stop processing the files and just serve them exactly as they are.

### Binary Files

If you are fetching images, PDFs, or custom binary formats, don't use `.text()`. Use `.blob()` or `.arrayBuffer()`:

```javascript
const response = await fetch('image.png');
const imageBlob = await response.blob();
const imageObjectURL = URL.createObjectURL(imageBlob);
document.querySelector('#myImage').src = imageObjectURL;
```

Would you like me to show you how to set up a specific parser (like Markdown or YAML) so you can actually use the data after fetching it?
