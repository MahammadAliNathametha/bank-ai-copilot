import { Card } from "@/components/ui/card";

export function Modal({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="fixed inset-0 grid place-items-center bg-white/10/20 p-6">
      <Card className="max-w-md">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="mt-3 text-sm text-slate-400">{description}</p>
      </Card>
    </div>
  );
}
