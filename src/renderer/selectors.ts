const selectors = {
  get markdownView() {
    return document.getElementById("markdown-view") as HTMLTextAreaElement;
  },
  get renderedView() {
    return document.getElementById("rendered-view") as HTMLDivElement;
  },
  get newFileButton() {
    return document.getElementById("new-file") as HTMLButtonElement;
  },
  get openFileButton() {
    return document.getElementById("open-file") as HTMLButtonElement;
  },
  get saveMarkdownButton() {
    return document.getElementById("save-markdown") as HTMLButtonElement;
  },
  get revertButton() {
    return document.getElementById("revert") as HTMLButtonElement;
  },
  get exportHtmlButton() {
    return document.getElementById("export-html") as HTMLButtonElement;
  },
  get showFileButton() {
    return document.getElementById("show-file") as HTMLButtonElement;
  },
  get openInDefaultApplicationButton() {
    return document.getElementById(
      "open-in-default-application",
    ) as HTMLButtonElement;
  },
};

export default selectors;
