## Assets <!-- {docsify-ignore-all} -->

- You could put all assets into `src/assets/`. An `assets.json` will generate automatically.

- The `assets.json` load at `src/scenes/BootScene.ts`. And the assets controlled in

  ```ts file=src/scenes/PreloadScene.ts highlight=3-6
  export class PreloadScene extends Phaser.Scene {
    preload() {
      const assetsJSON = this.cache.json.get(AssetsJson);
      // shared an lazyload correspond to the directory under  `src/assets`.
      this.load.addPack(assetsJSON, 'shared');
      this.addLazyLoader(assetsJSON, 'lazyload');
    }
  }
  ```

- During development, `webpack` does not generate files on disk. You could check the `assets.json` by URL `http://localhost:8080/assets/assets.json`.

- Filename end with number may consider as the same item. This design for a `spine` that has more than one image. For example

  ```
  spine
  ├──...
  ├──banners.atlas
  ├──banners.json
  ├──banners.png
  ├──banners2.png
  └──banners3.png
  ```

- Adding new asset type. <br />
  First define a `type` for the new asset

  ```ts file=webpack/asset-json-plugin/assets.d.ts
  interface NewAssetType {
    key: string;

    // The value must be key of "Phaser.Loader.LoaderPlugin"
    // for example `this.load.css` and `this.load.html`, so the type could be `css` or `html`
    // @See https://github.com/photonstorm/phaser/blob/3f511a73cdf0c14b774d4f9f7913b6d1a88c559b/src/loader/LoaderPlugin.js#L632-L642
    type: 'xxxx';

    // The other fields should check the "Phaser.Loader.FileTypes.XXXFile" classes source code
    // @See https://github.com/photonstorm/phaser/blob/d4b19cee5b8c11e4626048f5c5394ca60c283877/src/loader/filetypes/AudioSpriteFile.js#L49-L54
    // for example, function SVGFile (loader, key, url, svgConfig, xhrSettings) {}
    // ther other filed name could be "url" and "svgConfig"
    url: string;
    svgConfig: any;
  }

  type Asset =
    | ImageFile
    | JsonFile
    | AtlasFile
    | BitmapFontFile
    | SpineFile
    | AudioFile
    | AudioSprite
    | NewAssetType; // highlight-line
  ```

  Then update the checking in `webpack/asset-json-plugin/transform.js`
