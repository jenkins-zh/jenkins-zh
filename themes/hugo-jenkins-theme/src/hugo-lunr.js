const lunr = require("hugo-lunr-zh");
lunr({
  contextPath: "/blog",
  dir: "content/blog",
  output: "public/index.json",
  skipDraft: false
}).then(() => {
  console.log("done");
});
