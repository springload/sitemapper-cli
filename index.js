#!/usr/bin/env node
const Sitemapper = require("sitemapper");
const url = require("url");

if (process.argv.length < 3) {
  console.log(
    "Requires 1 argument of a URL of a sitemap.xml entry point (typically /sitemap.xml)"
  );
  process.exit();
}

const inputUrl = process.argv[2];

const parsedUrl = new URL(inputUrl);

const requestHeaders = {};

const { username, password } = parsedUrl;

if (username) {
  const usernamePasswordBuffer = Buffer.from(
    `${username}:${password}`,
    "utf-8"
  );
  const base64UsernamePassword = usernamePasswordBuffer.toString("base64");
  requestHeaders.Authorization = `Basic ${base64UsernamePassword}`;
}

const sitemap = new Sitemapper({ requestHeaders });

const urlWithoutCredentials = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}`;

// console.log({ urlWithoutCredentials, requestHeaders });

sitemap
  .fetch({ url: urlWithoutCredentials, retries: 3, requestHeaders })
  .then(function (sitemap) {
    const { errors, sites } = sitemap;

    if (errors && errors.length > 0) {
      console.log("Error loading sitemap.xml file");
      console.error(errors);
      return;
    }

    if (sites && sites.length > 0) {
      sites.forEach((siteUrl) => console.log(siteUrl));
    } else {
      console.log("There were no results for ", url);
    }
  });
