import { useState } from "react";
import type { Pass } from "../services/pass.types";

const VALID_LOCATIONS = [
  "classroom-a",
  "classroom-b",
  "library",
  "cafeteria",
  "gym",
  "restroom",
  "parking-lot",
];

interface PassFormProps {
  onSubmit: (data: {
    studentId: string;
    originLocationId: string;
    destinationLocationId: string;
    type?: Pass["type"];
    isGroup?: boolean;
    groupStudentIds?: string[];
  }) => void;
  onError?: (msg: string) => void;
}

export function PassForm({ onSubmit, onError }: PassFormProps) {
  const [studentId, setStudentId] = useState("");
  const [originLocationId, setOriginLocationId] = useState("");
  const [destinationLocationId, setDestinationLocationId] = useState("");
  const [type, setType] = useState<Pass["type"]>("restroom");
  const [isGroup, setIsGroup] = useState(false);
  const [groupStudentIds, setGroupStudentIds] = useState<string[]>([]);

  const handleGroupStudentChange = (idx: number, value: string) => {
    setGroupStudentIds((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleAddGroupStudent = () => {
    setGroupStudentIds((prev) => [...prev, ""]);
  };

  const handleRemoveGroupStudent = (idx: number) => {
    setGroupStudentIds((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!studentId && !isGroup) return "Student ID is required";
    if (!originLocationId) return "Origin location is required";
    if (!destinationLocationId) return "Destination location is required";
    if (originLocationId === destinationLocationId)
      return "Origin and destination cannot be the same";
    if (!VALID_LOCATIONS.includes(originLocationId))
      return "Origin location must be a valid location";
    if (!VALID_LOCATIONS.includes(destinationLocationId))
      return "Destination location must be a valid location";
    if (isGroup && groupStudentIds.some((id) => !id.trim()))
      return "All group student IDs are required";
    if (isGroup && groupStudentIds.includes(studentId))
      return "Group cannot include the main student ID";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      if (onError) onError(err);
      return;
    }
    if (onError) onError(""); // Clear any previous error
    onSubmit({
      studentId,
      originLocationId,
      destinationLocationId,
      type,
      isGroup,
      groupStudentIds: isGroup ? groupStudentIds : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>
          Student ID
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="input"
            placeholder="Student ID"
            data-cy="student-id-input"
            required={!isGroup}
            disabled={isGroup}
          />
        </label>
      </div>
      <div>
        <label>
          Origin Location
          <select
            value={originLocationId}
            onChange={(e) => setOriginLocationId(e.target.value)}
            className="input"
            data-cy="origin-location-input"
            required
          >
            <option value="">Select origin...</option>
            {VALID_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Destination Location
          <select
            value={destinationLocationId}
            onChange={(e) => setDestinationLocationId(e.target.value)}
            className="input"
            data-cy="destination-location-input"
            required
          >
            <option value="">Select destination...</option>
            {VALID_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
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
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
            data-cy="group-pass-checkbox"
          />
          Group Pass
        </label>
      </div>
      {isGroup && (
        <div className="space-y-2">
          <label>Group Student IDs</label>
          {groupStudentIds.map((id, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={id}
                onChange={(e) => handleGroupStudentChange(idx, e.target.value)}
                className="input"
                placeholder={`Student ID #${idx + 1}`}
                data-cy={`group-student-id-input-${idx}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveGroupStudent(idx)}
                className="btn btn-xs btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddGroupStudent}
            className="btn btn-xs btn-secondary"
            data-cy="add-group-student-btn"
          >
            Add Student
          </button>
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Create Pass
      </button>
    </form>
  );
}
