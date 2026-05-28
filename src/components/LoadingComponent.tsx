import Image from "next/image";

export default function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-full">
      <Image
        src="/gifs/loading.webp"
        alt="Loading"
        width={250}
        height={250}
        unoptimized
      />
    </div>
  );
};