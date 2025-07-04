import InputTestForm from '@/components/InputTestForm';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Touchscreen Testing
        </h1>
        <InputTestForm />
      </div>
    </main>
  );
}
