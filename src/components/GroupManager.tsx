import { useEffect, useState } from "react";
import type { Group, GroupType } from "../services/group.types";
import { createGroup, listGroups, deleteGroup } from "../services/group";

export function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<GroupType>("positive");
  const [students, setStudents] = useState("");

  const load = async () => {
    const list = await listGroups();
    setGroups(list);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAdd = async () => {
    if (!name) return;
    const studentIds = students
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    await createGroup({ name, type, studentIds });
    setName("");
    setStudents("");
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteGroup(id);
    await load();
  };

  return (
    <div className="space-y-2">
      <div className="space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          className="input"
          data-cy="group-name-input"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as GroupType)}
          className="input"
          data-cy="group-type-select"
        >
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
        <input
          value={students}
          onChange={(e) => setStudents(e.target.value)}
          placeholder="Student IDs"
          className="input"
          data-cy="group-students-input"
        />
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          data-cy="add-group-btn"
        >
          Add Group
        </button>
      </div>
      <ul data-cy="group-list">
        {groups.map((g) => (
          <li key={g.id} className="flex items-center space-x-2">
            <span>
              {g.name} ({g.type})
            </span>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(g.id)}
              data-cy={`del-${g.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
