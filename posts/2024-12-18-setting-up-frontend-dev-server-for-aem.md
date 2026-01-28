---
title: "Setting up frontend dev-server for AEM"
date: "2024-12-18"
tags: ["AEM", "front-end", "webpack"]
emoji: ""
---

## Summary

If you generated AEM project with AEM project archetype, you can start dev server by running `cd ui.frontend && npm run watch` but it does not somehow reflect changes you make in the css files immidiately.

In this article, I'll show you how to set up front-end development environment that reflects changes immediately that boosts up your UI development speed on AEM.

## Prerequisites

First, change the `start` command in `package.json` to the following:

```json
"start": "webpack-dev-server --open --config ./webpack.dev.js --env writeToDisk=true",
```

By default, webpack-dev-server serves the bundled files from memory for better performance during development. By doing this, webpack-dev-server will write to disk instead of keeping them only in memory.

You can still work on port 4502 but 8080 reloads much faster.

## Using webpack-dev-server

In your local author instance, go to any page and click `View as published` and view page source and copy the entire html content.
Then, go to `ui.frontend/src/main/webpack/index.html` and paste the content into `index.html`.

In the HTML you pasted, remove the `<link/>` and `<script/>` tags that include `clientlib-site` or `clientlib-dependencies`.

```html
<!-- remove -->
<script
  type="text/javascript"
  src="/etc.clientlibs/wknd/clientlibs/clientlib-dependencies.js"
></script>
<link
  rel="stylesheet"
  href="/etc.clientlibs/wknd/clientlibs/clientlib-dependencies.css"
  type="text/css"
/>
<link
  rel="stylesheet"
  href="/etc.clientlibs/wknd/clientlibs/clientlib-site.css"
  type="text/css"
/>
...
<script
  type="text/javascript"
  src="/etc.clientlibs/wknd/clientlibs/clientlib-site.js"
></script>
```

Here is the shell command to remove the `<link/>` and `<script/>` tags that include `clientlib-site` or `clientlib-dependencies`.

```shell
cd src/main/webpack/static
grep -v -E '(clientlib-site|clientlib-dependencies)' index.html > temp.html && mv temp.html index.html
cd ../../../../
```

Now you can `cd ui.frontend && npm start` and visit `http://localhost:8080`.

You can update your css files and see changes immediately. This is very useful when you are developing UI for AEM.

Happy hacking.

## References

- [Client libraries and front-end workflow | Adobe Experience Manager](https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/project-archetype/client-side-libraries#:~:text=Tools%20and%20Resources-,Webpack%20DevServer%20%2D%20Static%20Markup,-In%20the%20previous)
- [Getting Started with AEM Sites - Component Basics | Adobe Experience Manager](https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/project-archetype/component-basics#client-side-libraries)
