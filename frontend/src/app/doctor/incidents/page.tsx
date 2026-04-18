"use client";

import Incidents from "../../patient/incidents/page";

// Export the same component for the doctor route to adhere to DRY principles.
export default function DoctorIncidents() {
  return <Incidents />;
}
