import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="text-5xl font-black">৪০৪</p>
      <p className="mt-3 font-bold">এই পেজ পাওয়া যায়নি</p>
      <Link href="/" className="cta mt-6 flex items-center justify-center">
        হোমে যান
      </Link>
    </div>
  );
}
