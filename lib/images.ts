// Intrinsic sizes of the files in public/assets/images (used by next/image for aspect ratio).
const dir = "/assets/images";

export const images = {
  logo: { src: `${dir}/logo_icon.png`, width: 595, height: 624 },
  home: { src: `${dir}/home.png`, width: 1535, height: 1024 },
  paket4: { src: `${dir}/paket4.png`, width: 1988, height: 1238 },
  paket8: { src: `${dir}/paket8.png`, width: 1992, height: 1248 },
  paket16: { src: `${dir}/paket16.png`, width: 1988, height: 1174 },
  produk: { src: `${dir}/produk.png`, width: 1448, height: 1086 },
  solusi: { src: `${dir}/solusi.png`, width: 1448, height: 1086 },
  coverage: { src: `${dir}/coverage.png`, width: 1536, height: 1024 },
  monitoring: { src: `${dir}/monitoring.png`, width: 1447, height: 1087 },
  tentang: { src: `${dir}/tentang.png`, width: 1447, height: 1087 },
  whatsappWhite: { src: `${dir}/whatsapp-white.png`, width: 512, height: 512 },
  whatsappGold: { src: `${dir}/whatsapp-gold.png`, width: 512, height: 512 },
  whatsappBlue: { src: `${dir}/whatsapp-blue.png`, width: 280, height: 280 },
} as const;
