#!/usr/bin/env node
const Sitemapper = require("sitemapper");

const sitemap = new Sitemapper();

if (process.argv.length < 3) {
  console.log(
    "Requires 1 argument of a URL of a sitemap.xml entry point (typically /sitemap.xml)"
  );
  process.exit();
}

const url = process.argv[2];

sitemap.fetch({ url, retries: 3 }).then(function (sitemap) {
  const { errors, sites } = sitemap;

  if (errors && errors.length > 0) {
    console.error(errors);
    return;
  }

  if (sites && sites.length > 0) {
    sites.forEach((siteUrl) => console.log(siteUrl));
  } else {
    console.log("There were no results for ", url);
  }
});
