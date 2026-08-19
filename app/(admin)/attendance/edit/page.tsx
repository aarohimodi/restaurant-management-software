import { Suspense } from "react";
import EditAttendanceContent from "./EditAttendanceContent";

export default function EditAttendancePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditAttendanceContent />
    </Suspense>
  );
}
