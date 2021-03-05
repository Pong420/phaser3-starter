/**
 *  Note for adding new asset type take a look at /docs/assets.md
 */

interface AssetsEntry {
  input: string;
  path: string;
}

interface AssetsJSONOptions {
  from: AssetsEntry[];
  to: string;
  include?: string[];
  exclude?: string[];
}

interface FileInfo {
  packKey: string;
  files: string[];
  fileTypes: string[];
  filenameByType: Record<string, string>;
}

interface ImageFile {
  type: 'image';
  key: string;
  url: string;
}

interface JsonFile {
  type: 'json';
  key: string;
  url: string;
}

interface AtlasFile {
  type: 'atlas';
  key: string;
  textureURL: string;
  atlasURL: string;
}

interface BitmapFontFile {
  key: string;
  type: 'bitmapFont';
  xSpacing?: number;
  ySpacing?: number;
  textureURL: string;
  fontDataURL: string;
}

interface SpineFile {
  key: string;
  type: 'spine';
  atlasURL: string;
  jsonURL: string;
}

interface AudioFile {
  key: string;
  type: 'audio';
  audioURL: string | string[];
}

interface AudioSprite extends Omit<AudioFile, 'type'> {
  type: 'audioSprite';
}

type Asset =
  | ImageFile
  | JsonFile
  | AtlasFile
  | BitmapFontFile
  | SpineFile
  | AudioFile
  | AudioSprite;

type AssetPack = {
  prefix?: string; // optional, extend key by prefix
  path?: string; // optional, extend url by path
  defaultType?: string; // optional, default file type
  files: Asset[];
};
