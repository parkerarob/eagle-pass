import { useState } from "react";
import type { Pass } from "../services/pass.types";

interface PassFormProps {
  onSubmit: (data: {
    studentId: string;
    originLocationId: string;
    type?: Pass["type"];
  }) => void;
}

export function PassForm({ onSubmit }: PassFormProps) {
  const [studentId, setStudentId] = useState("");
  const [originLocationId, setOriginLocationId] = useState("");
  const [type, setType] = useState<Pass["type"]>("restroom");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ studentId, originLocationId, type });
      }}
      className="space-y-4"
    >
      <div>
        <label>
          Student ID
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="input"
            placeholder="Student ID"
            data-cy="student-id-input"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Origin Location
          <input
            value={originLocationId}
            onChange={(e) => setOriginLocationId(e.target.value)}
            className="input"
            placeholder="Origin Location"
            data-cy="origin-location-input"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Pass["type"])}
            className="input"
            data-cy="pass-type-select"
          >
            <option value="restroom">Restroom</option>
            <option value="parking">Parking Lot</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Create Pass
      </button>
    </form>
  );
}
