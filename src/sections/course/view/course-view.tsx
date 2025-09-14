import { useState, useEffect } from "react";

import {
  Box,
  Chip,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import api from "src/utils/api";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

import { CourseTable } from "./course-table"; // adjust path

const API_URL = `${import.meta.env.VITE_API_URL}/courses`;
const CATEGORY_API = `${import.meta.env.VITE_API_URL}/categories`;

export function CourseView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Add course form state
  const [newCourse, setNewCourse] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDiscountPrice, setNewDiscountPrice] = useState("");
  const [newLessonsCount, setNewLessonsCount] = useState("");
  const [newRating, setNewRating] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Edit course form state
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountPrice, setEditDiscountPrice] = useState("");
  const [editLessonsCount, setEditLessonsCount] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);

  // Fetch courses
  useEffect(() => {
    api.get(API_URL).then((res) => setCourses(res.data.data));
  }, []);

  console.log("Courses:", courses);

  // Fetch categories
  useEffect(() => {
    api.get(CATEGORY_API).then((res) => setCategories(res.data.data));
  }, []);

  // Handle Add
  const handleAdd = async () => {
    if (!newCourse || !newCategory) return;

    const formData = new FormData();
    formData.append("title", newCourse.trim());
    formData.append("description", newDesc.trim());
    formData.append("category", newCategory);
    formData.append("price", newPrice || "0");
    formData.append("discountPrice", newDiscountPrice || "0");
    formData.append("lessonsCount", newLessonsCount || "1");
    formData.append("rating", newRating || "0");
    if (newImage) formData.append("thumbnail", newImage);

    const res = await api.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setCourses([res.data.data, ...courses]);
    setNewCourse("");
    setNewDesc("");
    setNewCategory("");
    setNewPrice("");
    setNewDiscountPrice("");
    setNewLessonsCount("");
    setNewRating("");
    setNewImage(null);
    setPreviewImage(null);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    await api.delete(`${API_URL}/${id}`);
    setCourses(courses.filter((c) => c._id !== id));
  };

  // Open Edit Dialog
  const handleEditOpen = (id: string) => {
    const course = courses.find((c) => c._id === id);
    if (!course) return;

    setEditId(course._id);
    setEditValue(course.title || "");
    setEditDesc(course.description || "");
    setEditCategory(course.category?._id || "");
    setEditPrice(course.price?.toString() || "");
    setEditDiscountPrice(course.discountPrice?.toString() || "");
    setEditLessonsCount(course.lessonsCount?.toString() || "");
    setEditRating(course.rating?.toString() || "");
    setEditImage(null);
    setEditPreviewImage(course.thumbnail || null);
  };

  // Handle Save Edit
  const handleEditSave = async () => {
    if (!editId) return;

    const formData = new FormData();
    formData.append("title", editValue.trim());
    formData.append("description", editDesc.trim());
    formData.append("category", editCategory);
    formData.append("price", editPrice || "0");
    formData.append("discountPrice", editDiscountPrice || "0");
    formData.append("lessonsCount", editLessonsCount || "1");
    formData.append("rating", editRating || "0");
    if (editImage) formData.append("thumbnail", editImage);

    try {
      const res = await api.put(`${API_URL}/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourses(
        courses.map((c) => (c._id === editId ? res.data.data : c))
      );

      // Reset edit state
      setEditId(null);
      setEditValue("");
      setEditDesc("");
      setEditCategory("");
      setEditPrice("");
      setEditDiscountPrice("");
      setEditLessonsCount("");
      setEditRating("");
      setEditImage(null);
      setEditPreviewImage(null);
    } catch (err) {
      console.error("Failed to save edit:", err);
    }
  };

  return (
    <DashboardContent>
      {/* Add Course Form */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Add Course
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Course Title"
          variant="outlined"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          fullWidth
        />
        <TextField
          label="Discount Price"
          type="number"
          value={newDiscountPrice}
          onChange={(e) => setNewDiscountPrice(e.target.value)}
          fullWidth
        />
        <TextField
          label="Lessons Count"
          type="number"
          value={newLessonsCount}
          onChange={(e) => setNewLessonsCount(e.target.value)}
          fullWidth
        />
        <TextField
          label="Rating (0-5)"
          type="number"
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          value={newRating}
          onChange={(e) => setNewRating(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          fullWidth
        />

        <Box>
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setNewImage(file);
                if (file) setPreviewImage(URL.createObjectURL(file));
              }}
            />
          </Button>
          {previewImage && (
            <Box mt={2}>
              <img
                src={previewImage}
                alt="Preview"
                width={120}
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Box>

      {/* Courses Table */}
      <CourseTable
        courses={courses}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
      />

      {/* Edit Course Dialog */}
      <Dialog
        open={!!editId}
        onClose={() => setEditId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Course Title"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Price"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Discount Price"
            type="number"
            value={editDiscountPrice}
            onChange={(e) => setEditDiscountPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Lessons Count"
            type="number"
            value={editLessonsCount}
            onChange={(e) => setEditLessonsCount(e.target.value)}
            fullWidth
          />
          <TextField
            label="Rating (0-5)"
            type="number"
            value={editRating}
            onChange={(e) => setEditRating(e.target.value)}
            fullWidth
          />

          <Box>
            <Button variant="outlined" component="label">
              Upload New Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setEditImage(file);
                  if (file) setEditPreviewImage(URL.createObjectURL(file));
                }}
              />
            </Button>
            {editPreviewImage && (
              <Box mt={2}>
                <img
                  src={editPreviewImage}
                  alt="Preview"
                  width={120}
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
