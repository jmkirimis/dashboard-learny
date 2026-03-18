import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-[50%] h-full">
      <Image
        src="/gifs/loading.gif"
        alt="Loading"
        width={250}
        height={250}
        unoptimized
      />
    </div>
  );
};