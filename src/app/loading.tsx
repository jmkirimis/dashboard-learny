import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex bg-white items-center justify-center h-screen">
      <Image
        src="/gifs/loading.gif"
        alt="Loading"
        width={300}
        height={300}
        unoptimized
      />
    </div>
  );
}
