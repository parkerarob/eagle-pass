import { useState } from "react";
import type { Pass } from "../services/pass.types";

interface PassFormProps {
  onSubmit: (data: {
    studentId: string;
    originLocationId: string;
    destinationId: string;
    groupSize: number;
    type?: Pass["type"];
  }) => void;
}

export function PassForm({ onSubmit }: PassFormProps) {
  const [studentId, setStudentId] = useState("");
  const [originLocationId, setOriginLocationId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [type, setType] = useState<Pass["type"]>("restroom");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          studentId,
          originLocationId,
          destinationId,
          groupSize,
          type,
        });
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
          Destination
          <input
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="input"
            placeholder="Destination"
            data-cy="destination-input"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Group Size
          <input
            type="number"
            min={1}
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            className="input"
            data-cy="group-size-input"
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
            <option value="regular">Regular</option>
            <option value="restroom">Restroom</option>
            <option value="parking">Parking Lot</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Create Pass
      </button>
    </form>
  );
}
