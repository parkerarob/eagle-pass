import { useState } from "react";

interface CheckInButtonProps {
  onCheckIn: (locationId: string) => void;
  disabled?: boolean;
}

export function CheckInButton({ onCheckIn, disabled }: CheckInButtonProps) {
  const [locationId, setLocationId] = useState("");
  return (
    <div className="flex items-center space-x-2">
      <input
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        className="input"
        placeholder="Location ID"
      />
      <button
        type="button"
        className="btn btn-secondary"
        disabled={disabled || !locationId}
        onClick={() => onCheckIn(locationId)}
      >
        Check In
      </button>
    </div>
  );
}
