import FileConverter  from '../components/FileConverter'

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">File Converter</h1>
        <FileConverter />
      </main>
    </div>
  );
}
