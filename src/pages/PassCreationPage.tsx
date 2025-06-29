import { PassForm } from "../components/PassForm";

export default function PassCreationPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 p-4" data-testid="pass-create">
      <h1 className="text-2xl font-bold">Create Pass</h1>
      <PassForm onSubmit={() => {}} />
    </div>
  );
}
