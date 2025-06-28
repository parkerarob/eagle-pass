import { render, screen } from "@testing-library/react";
import UserProfile from "../UserProfile";

describe("UserProfile", () => {
  it("renders user info", () => {
    render(
      <UserProfile name="Alice" email="alice@school.edu" role="student" />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@school.edu")).toBeInTheDocument();
    expect(screen.getByText("student")).toBeInTheDocument();
  });
});
