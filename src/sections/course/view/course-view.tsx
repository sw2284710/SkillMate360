import axios from "axios";
import { useState, useEffect } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import api from 'src/utils/api';

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

const API_URL = `${import.meta.env.VITE_API_URL}/courses`;

export function CourseView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch courses from DB
  useEffect(() => {
    api.get(API_URL).then((res) => setCourses(res.data.data));
  }, []);

  // Add new interest
  const handleAdd = async () => {
    if (newCourse.trim() === "") return;
    const res = await api.post(API_URL, { title: newCourse.trim() });
    setCourses([ res.data.data, ...courses]);
    setNewCourse("");
  };

  // Delete interest
  const handleDelete = async (id: string) => {
    await api.delete(`${API_URL}/${id}`);
    setCourses(courses.filter((i) => i._id !== id));
  };

  // Open edit dialog
  const handleEditOpen = (index: number) => {
    setEditIndex(index);
    setEditValue(courses[index].title);
  };

  // Save edited interest
  const handleEditSave = async () => {
    if (editIndex === null) return;
    const interest = courses[editIndex];
    const res = await api.put(`${API_URL}/${interest._id}`, { title: editValue.trim() });

    const updated = [...courses];
    updated[editIndex] = res.data.data;
    setCourses(updated);

    setEditIndex(null);
    setEditValue("");
  };

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Courses
        </Typography>
      </Box>

      {/* Add Course */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter Course"
          variant="outlined"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Box>

      {/* Interests List */}
      {courses.length === 0 ? (
        <Typography color="text.secondary">No courses added yet.</Typography>
      ) : (
        <Box sx={{ maxHeight:500, overflow: 'auto' }}>
          <List>
            {courses.map((course, index) => (
              <ListItem key={course._id} divider>
                <ListItemText primary={course.title} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleEditOpen(index)}
                  >
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDelete(course._id)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIndex(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
