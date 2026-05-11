import { RegisterView } from "@/modules/auth/ui/views/register";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <RegisterView />
    </div>
  );
}