import { useState } from "react";
import { PassForm } from "../components/PassForm";
import { CheckInButton } from "../components/CheckInButton";
import { ReturnButton } from "../components/ReturnButton";
import { createPass, checkIn, returnPass } from "../services/pass";
import type { Pass } from "../services/pass.types";

export default function PassLifecyclePage() {
  const [pass, setPass] = useState<Pass | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePass = async (data: {
    studentId: string;
    originLocationId: string;
    destinationLocationId: string;
    type?: Pass["type"];
    isGroup?: boolean;
    groupStudentIds?: string[];
  }) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const newPass = await createPass(
        data.studentId,
        data.originLocationId,
        "staff1",
        data.destinationLocationId,
        data.type,
        data.isGroup,
        data.groupStudentIds,
      );
      setPass(newPass);
      setMessage("Pass created successfully!");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (locationId: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!pass) return;
      const updatedPass = await checkIn(pass.id, locationId);
      setMessage("Checked in successfully!");
      setPass(updatedPass);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!pass) return;
      await returnPass(pass.id);
      setPass({ ...pass, status: "closed", closedAt: Date.now() });
      setMessage("Pass returned and closed!");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <h1 className="text-2xl font-bold">Pass Lifecycle Demo</h1>
      {!pass || pass.status === "closed" ? (
        <PassForm onSubmit={handleCreatePass} />
      ) : (
        <>
          <CheckInButton
            onCheckIn={handleCheckIn}
            disabled={loading || (pass as Pass).status === "closed"}
          />
          <ReturnButton
            onReturn={handleReturn}
            disabled={loading || (pass as Pass).status === "closed"}
          />
        </>
      )}
      {message && (
        <div className="text-green-600" data-cy="success-msg">
          {message}
        </div>
      )}
      {error && (
        <div className="text-red-600" data-cy="error-msg">
          {error}
        </div>
      )}
    </div>
  );
}
