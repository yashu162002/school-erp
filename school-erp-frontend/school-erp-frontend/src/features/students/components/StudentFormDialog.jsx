import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { studentSchema } from "@/features/students/schemas/student.schema";
import { apiClient } from "@/api/client";
import { getStudentPhotoUrl } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const EMPTY_VALUES = {
  admissionNo: "",
  firstName: "",
  lastName: "",
  className: "",
  section: "",
  studentPhone: "",
  email: "",
  rollNo: "",
  religion: "",
  category: "",
  fatherName: "",
  motherName: "",
  guardian: "",
  academicYear: "2026",
  admissionDate: "",
  transport: "",
  hostel: "",
  house: "",
  emergencyContact: "",
  medicalInfo: "",
  status: "ACTIVE",
  attendancePercentage: "",
  currentGpa: "",
  currentRank: "",
  photoPath: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  address: "",
};

export function StudentFormDialog({ open, onOpenChange, student, onSubmit, isSubmitting }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      if (student) {
        // Map null/number values to empty strings or matching formats
        const mapped = { ...EMPTY_VALUES };
        Object.keys(EMPTY_VALUES).forEach((key) => {
          if (student[key] !== undefined && student[key] !== null) {
            mapped[key] = student[key];
          }
        });
        form.reset(mapped);
      } else {
        form.reset(EMPTY_VALUES);
      }
    }
  }, [open, student]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG)");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await apiClient.post("/admin/students/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // The backend returns the relative path of the uploaded file
      const returnedPath = response.data;
      form.setValue("photoPath", returnedPath);
      toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error("Failed to upload photo", err);
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (values) => {
    // Convert numeric fields back if they are valid numbers
    const processed = { ...values };
    if (values.attendancePercentage !== "") processed.attendancePercentage = Number(values.attendancePercentage);
    if (values.currentGpa !== "") processed.currentGpa = Number(values.currentGpa);
    if (values.currentRank !== "") processed.currentRank = Number(values.currentRank);
    onSubmit(processed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student Details" : "Register Student"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
              
              {/* Photo Upload Zone (Media Picker / Drag and Drop) */}
              <div 
                className="flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-border rounded-lg p-5 bg-muted/10 hover:bg-muted/20 transition-colors relative cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : form.watch("photoPath") ? (
                    <img
                      src={getStudentPhotoUrl(form.watch("photoPath"))}
                      alt="Student Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="text-center">
                  <span className="text-xs font-semibold text-primary block hover:underline">
                    {form.watch("photoPath") ? "Change Student Photo" : "Upload Student Photo"}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Drag and drop file here, or click to browse
                  </p>
                </div>
                
                {form.watch("photoPath") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-7 w-7 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      form.setValue("photoPath", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">
                  1. Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="admissionNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission No (Auto-generated if empty)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ADM202600001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rollNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Personal details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">
                  2. Personal & Health details
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3.5 h-9">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-normal text-foreground">
                              <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={field.value === "Male"}
                                onChange={() => field.onChange("Male")}
                                className="h-4 w-4 border-border text-primary focus:ring-primary"
                              />
                              Male
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-normal text-foreground">
                              <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={field.value === "Female"}
                                onChange={() => field.onChange("Female")}
                                className="h-4 w-4 border-border text-primary focus:ring-primary"
                              />
                              Female
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-normal text-foreground">
                              <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={field.value === "Other"}
                                onChange={() => field.onChange("Other")}
                                className="h-4 w-4 border-border text-primary focus:ring-primary"
                              />
                              Other
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. O+" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Christian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. General" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalInfo"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Medical Alerts / Info</FormLabel>
                        <FormControl>
                          <Input placeholder="Allergies, medicines, conditions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Parents */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">
                  3. Parent & Guardian Info
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guardian"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guardian Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Emergency Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Guardian/Emergency phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4: Academic & Services */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">
                  4. Academic Status, Facilities & Performance
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2026" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="admissionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Date</FormLabel>
                        <FormControl>
                          <Input placeholder="YYYY-MM-DD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="house"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School House</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Red House" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Facility</FormLabel>
                        <FormControl>
                          <Input placeholder="Route/Bus number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hostel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hostel Block</FormLabel>
                        <FormControl>
                          <Input placeholder="Room/Hostel details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input placeholder="ACTIVE / INACTIVE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attendancePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attendance %</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 95" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentGpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current GPA</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 3.8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentRank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Rank</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {student ? "Save changes" : "Add student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
