import { TextureInfo, TexturesInfo, GameTextures } from "./types";

const hexToRGBA = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b, 255];
};

function loadAndRecolorTexture(texture: TextureInfo) {
  return new Promise<OffscreenCanvas>((resolve) => {
    const image = new Image();
    image.src = texture.path;
    image.onload = () => {
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d")!;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const rgba = hexToRGBA(texture.color);
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          data[i] = rgba[0];
          data[i + 1] = rgba[1];
          data[i + 2] = rgba[2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
  });
}

export default async function loadTextures(
  textures: TexturesInfo,
): Promise<GameTextures> {
  const [dino, cactus, pterodactyl, coin] = await Promise.all([
    loadAndRecolorTexture(textures.dino),
    loadAndRecolorTexture(textures.cactus),
    loadAndRecolorTexture(textures.pterodactyl),
    loadAndRecolorTexture(textures.coin),
  ]);
  return { dino, cactus, pterodactyl, coin };
}
