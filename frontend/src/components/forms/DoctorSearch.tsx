"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchPatient } from "../../api/patients";
import { PatientCard } from "../../types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Search } from "lucide-react";

export function DoctorSearch({
  onFound,
}: {
  onFound?: (patient: PatientCard) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError("");

    try {
      const cleanIdentifier = identifier.trim();
      const data = await searchPatient(cleanIdentifier);

      if (onFound) onFound(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Patient not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex max-w-lg gap-2">
      <Input
        placeholder="Enter Name, ID, or Phone..."
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