import Image from "next/image";
import { images } from "@/lib/images";

const variants = {
  white: images.whatsappWhite,
  gold: images.whatsappGold,
  blue: images.whatsappBlue,
} as const;

export function WhatsAppIcon({ variant }: { variant: keyof typeof variants }) {
  return (
    <Image
      {...variants[variant]}
      alt=""
      aria-hidden="true"
      className={`wa-icon wa-icon-${variant}`}
      draggable={false}
      sizes="32px"
    />
  );
}
