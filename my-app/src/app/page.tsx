import Signup from '@/components/Signup';

export default function Home() {
  return (
    <div
      className="flex flex-col gap-8 justify-center items-center h-[100vh] "
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <h1 className="text-4xl font-bold">Finance</h1>
      <Signup />
    </div>
  );
}
