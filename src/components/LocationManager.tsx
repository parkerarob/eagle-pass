import { useEffect, useState } from "react";
import type { Location } from "../services/location.types";
import {
  createLocation,
  listLocations,
  deleteLocation,
} from "../services/location";

export function LocationManager() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const list = await listLocations();
    setLocations(list);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAdd = async () => {
    if (!name) return;
    await createLocation({ name });
    setName("");
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteLocation(id);
    await load();
  };

  return (
    <div className="space-y-2">
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Location name"
          className="input"
          data-cy="location-name-input"
        />
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          data-cy="add-location-btn"
        >
          Add Location
        </button>
      </div>
      <ul data-cy="location-list">
        {locations.map((loc) => (
          <li key={loc.id} className="flex items-center space-x-2">
            <span>{loc.name}</span>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(loc.id)}
              data-cy={`del-${loc.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
