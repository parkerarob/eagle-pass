import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Pass } from "../services/pass.types";
import { Button } from "./ui/button";
import { FormProvider } from "react-hook-form";
import { FormField } from "./FormField";

const schema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  originLocationId: z.string().min(1, "Origin location is required"),
  destinationId: z.string().min(1, "Destination is required"),
  groupSize: z.number().min(1, "Group size must be at least 1"),
  type: z.enum(["regular", "restroom", "parking"]).default("restroom"),
});

type FormValues = z.infer<typeof schema>;

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
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: "",
      originLocationId: "",
      destinationId: "",
      groupSize: 1,
      type: "restroom",
    },
    mode: "onChange",
  });

  const submit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} className="space-y-4">
        <FormField
          name="studentId"
          label="Student ID"
          placeholder="Student ID"
          inputProps={{ "data-cy": "student-id-input" }}
        />
        <FormField
          name="originLocationId"
          label="Origin Location"
          placeholder="Origin Location"
          inputProps={{ "data-cy": "origin-location-input" }}
        />
        <FormField
          name="destinationId"
          label="Destination"
          placeholder="Destination"
          inputProps={{ "data-cy": "destination-input" }}
        />
        <FormField
          name="groupSize"
          label="Group Size"
          type="number"
          inputProps={{ "data-cy": "group-size-input", min: 1 }}
          registerOptions={{ valueAsNumber: true }}
        />
        <FormField
          name="type"
          label="Type"
          selectProps={{ "data-cy": "pass-type-select" }}
          options={[
            { value: "regular", label: "Regular" },
            { value: "restroom", label: "Restroom" },
            { value: "parking", label: "Parking Lot" },
          ]}
        />
        <Button type="submit" data-cy="create-pass-button">
          Create Pass
        </Button>
      </form>
    </FormProvider>
  );
}
