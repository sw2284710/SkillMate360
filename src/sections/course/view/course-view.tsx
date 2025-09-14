import * as yup from "yup";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
} from "@mui/material";

import api from "src/utils/api";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

import { CourseTable } from "./course-table";

const API_URL = `${import.meta.env.VITE_API_URL}/courses`;
const CATEGORY_API = `${import.meta.env.VITE_API_URL}/categories`;

interface FormData {
  title: string;
  description: string;
  category: string;
  price: number;
  lessonsCount: number;
  discountPrice: number | null; // optional remove, use null as default
  rating: number | null; // optional remove
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  lessonsCount: yup
    .number()
    .typeError("Lessons count must be a number")
    .min(1, "At least one lesson is required")
    .required("Lessons count is required"),
  discountPrice: yup
    .number()
    .nullable()
    .optional()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .max(yup.ref("price"), "Discount must be less than price"),
  rating: yup
    .number()
    .typeError("Rating must be a number")
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5"),
});

export function CourseView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch courses
  useEffect(() => {
    api.get(API_URL).then((res) => setCourses(res.data.data));
  }, []);

  // Fetch categories
  useEffect(() => {
    api.get(CATEGORY_API).then((res) => setCategories(res.data.data));
  }, []);

  // RHF for Add
  const {
  register: addRegister,
  handleSubmit: addHandleSubmit,
  reset: addReset,
  formState: { errors: addErrors, isSubmitting: addSubmitting },
} = useForm<FormData>({
  resolver: yupResolver(schema) as any, // <-- TypeScript fix
  defaultValues: {
    title: "",
    description: "",
    category: "",
    price: 0,
    lessonsCount: 1,
    discountPrice: null,
    rating: null,
  },
});

  // RHF for Edit
  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors, isSubmitting: editSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any, // <-- TypeScript fix
  });

  const handleAddSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value.toString());
      });
      if (imageFile) formData.append("thumbnail", imageFile);

      const res = await api.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourses([res.data.data, ...courses]);
      addReset();
      setPreviewImage(null);
      setImageFile(null);
      setAddOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit: SubmitHandler<FormData> = async (data) => {
    if (!editingCourse) return;
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value.toString());
      });
      if (imageFile) formData.append("thumbnail", imageFile);

      const res = await api.put(`${API_URL}/${editingCourse._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourses(courses.map((c) => (c._id === editingCourse._id ? res.data.data : c)));
      editReset();
      setPreviewImage(null);
      setImageFile(null);
      setEditOpen(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = async (course: any) => {
  try {
    const res = await api.get(`${API_URL}/${course}`);
    const freshCourse = res.data.data;

    setEditingCourse(freshCourse);
    editReset({
      title: freshCourse.title || "",
      description: freshCourse.description || "",
      category: freshCourse.category || "",
      price: freshCourse.price || 0,
      lessonsCount: freshCourse.lessonsCount || 1,
      discountPrice: freshCourse.discountPrice ?? null,
      rating: freshCourse.rating ?? null,
    });
    setPreviewImage(freshCourse.thumbnail ?? null);
    setEditOpen(true);
  } catch (err) {
    console.error("Failed to fetch course details", err);
  }
};


  return (
    <DashboardContent>
      {/* Add Course */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Courses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon={addOpen ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"} />}
          onClick={() => setAddOpen(!addOpen)}
        >
          {addOpen ? "Collapse Add Form" : "Add New Course"}
        </Button>
      </Box>

      <Collapse in={addOpen}>
        <Box component="form" onSubmit={addHandleSubmit(handleAddSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <TextField label="Course Title" fullWidth {...addRegister("title")} error={!!addErrors.title} helperText={addErrors.title?.message} />
          <TextField label="Description" multiline rows={3} fullWidth {...addRegister("description")} error={!!addErrors.description} helperText={addErrors.description?.message} />
          <FormControl fullWidth error={!!addErrors.category}>
            <InputLabel>Category</InputLabel>
            <Select {...addRegister("category")} defaultValue="">
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error" variant="caption">
              {addErrors.category?.message}
            </Typography>
          </FormControl>
          <TextField label="Price" type="number" fullWidth {...addRegister("price")} error={!!addErrors.price} helperText={addErrors.price?.message} />
          <TextField label="Discount Price" type="number" fullWidth {...addRegister("discountPrice")} error={!!addErrors.discountPrice} helperText={addErrors.discountPrice?.message} />
          <TextField label="Lessons Count" type="number" fullWidth {...addRegister("lessonsCount")} error={!!addErrors.lessonsCount} helperText={addErrors.lessonsCount?.message} />
          <TextField
            label="Rating (0-5)"
            type="number"
            inputProps={{ step: "0.1", min: 0, max: 5 }} // <-- allow decimals
            fullWidth
            {...addRegister("rating")}
            error={!!addErrors.rating}
            helperText={addErrors.rating?.message}
          />

          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) setPreviewImage(URL.createObjectURL(file));
              }}
            />
          </Button>
          {previewImage && <img src={previewImage} alt="Preview" width={120} style={{ borderRadius: 8 }} />}

          <Button type="submit" variant="contained" disabled={addSubmitting}>
            {addSubmitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Collapse>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={editHandleSubmit(handleEditSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Course Title"
              fullWidth
              {...editRegister("title")}
              error={!!editErrors.title}
              helperText={editErrors.title?.message}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              {...editRegister("description")}
              error={!!editErrors.description}
              helperText={editErrors.description?.message}
            />
            <FormControl fullWidth error={!!editErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select {...editRegister("category")} defaultValue="">
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography color="error" variant="caption">
                {editErrors.category?.message}
              </Typography>
            </FormControl>

            <TextField
              label="Price"
              type="number"
              fullWidth
              {...editRegister("price")}
              error={!!editErrors.price}
              helperText={editErrors.price?.message}
            />
            <TextField
              label="Discount Price"
              type="number"
              fullWidth
              {...editRegister("discountPrice")}
              error={!!editErrors.discountPrice}
              helperText={editErrors.discountPrice?.message}
            />
            <TextField
              label="Lessons Count"
              type="number"
              fullWidth
              {...editRegister("lessonsCount")}
              error={!!editErrors.lessonsCount}
              helperText={editErrors.lessonsCount?.message}
            />
            <TextField
              label="Rating (0-5)"
              type="number"
              inputProps={{ step: "0.1", min: 0, max: 5 }} // <-- allow decimals
              fullWidth
              {...editRegister("rating")}
              error={!!editErrors.rating}
              helperText={editErrors.rating?.message}
            />

            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setPreviewImage(file ? URL.createObjectURL(file) : previewImage);
                }}
              />
            </Button>

            {previewImage && (
              <img src={previewImage} alt="Preview" width={120} style={{ borderRadius: 8 }} />
            )}

            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={editSubmitting}>
                {editSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>



      <CourseTable
        courses={courses}
        onEdit={startEdit}
        onDelete={async (courseId: string) => {
          try {
            await api.delete(`${API_URL}/${courseId}`);
            setCourses(courses.filter((c) => c._id !== courseId));
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </DashboardContent>
  );
}
