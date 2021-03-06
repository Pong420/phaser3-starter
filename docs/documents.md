## Documents <!--{docsify-ignore-all}-->

This document produce by [docsify](https://docsify.js.org/#/). My [docsify-starter](https://github.com/Pong420/docsify-starter)

<br />

- You could access at `http://localhost:8080/docs` during development but no live reload.

- To enable live reload run

  ```bash
  yarn docs
  # custom port
  yarn docs --port 5000
  ```

- Excute [docsify-cli](https://github.com/docsifyjs/docsify-cli) by

  ```bash
  yarn docsify
  ```

### Plugins

List of plugins that used

- [docsify-darklight-theme](https://github.com/boopathikumar018/docsify-darklight-theme) - The main styles of this document. With some customized style handled in `docs/js/darklightTheme.js` and `docs/assets/style.css`

- [Prism](https://prismjs.com/) - Used by docsify for code block. There are some extra prism components/plugins added

  - `prism-bash`
  - `prism-json`
  - `prism-typescript`
  - `prism-line-highlight`

- [docsify-pagination](https://github.com/imyelo/docsify-pagination) - Add page navigation components at footer

- [mermaid-docsify](https://github.com/Leward/mermaid-docsify) - Enable [mermaid](https://github.com/mermaid-js/mermaid) in docsify. It is a diagramming and charting tool that uses Markdown-inspired text definitions.

- `docs/js/scrollbar.js` - Mainly for change scrollbar style of window browser
- `docs/js/markdown.js` - Add file and line highlight in a code block
