# extension-sample

### Install project's node modules

```
npm install
```

### Steps for Chrome development

1. `npm run dev` launches webpack + watcher.
2. Open chrome://extensions, enable developer mode
3. Load unpacked extension from `build` folder
4. If you change background / content endpoints, you need to reload extension from `chrome://extensions`. 

After the backround.js changes you need to reload extension (at chrome://extensions) 
After the content.js changes  you need to reload both extension and active tab
