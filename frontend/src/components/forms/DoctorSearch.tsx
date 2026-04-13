import { useState } from "react";
import { searchPatient } from "../../api/patients";
import { PatientCard } from "../../types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Search, AlertCircle } from "lucide-react";

export function DoctorSearch({ onFound }: { onFound: (patient: PatientCard) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setLoading(true);
    setError("");
    try {
      const data = await searchPatient(identifier);
      onFound(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Patient not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex max-w-lg gap-2">
      <Input
        placeholder="Enter Emergency ID (e.g. EMG-1234)"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={error}
        className="flex-1"
      />
      <Button type="submit" isLoading={loading} className="px-6 self-start">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
