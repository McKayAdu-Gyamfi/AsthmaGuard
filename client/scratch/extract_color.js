const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
  console.log(`Color: rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);
  const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
  console.log(`Hex: ${hex}`);
};
img.src = '/favicon.png';
