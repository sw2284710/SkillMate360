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

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

export function CategoryView() {
  const [category, setCategory] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch category from DB
  useEffect(() => {
    api.get(API_URL).then((res) => setCategory(res.data.data));
  }, []);

  // Add new interest
  const handleAdd = async () => {
    if (newCategory.trim() === "") return;
    const res = await api.post(API_URL, { name: newCategory.trim() });
    setCategory([ res.data.data, ...category]);
    setNewCategory("");
  };

  // Delete interest
  const handleDelete = async (id: string) => {
    await api.delete(`${API_URL}/${id}`);
    setCategory(category.filter((i) => i._id !== id));
  };

  // Open edit dialog
  const handleEditOpen = (index: number) => {
    setEditIndex(index);
    setEditValue(category[index].name);
  };

  // Save edited interest
  const handleEditSave = async () => {
    if (editIndex === null) return;
    const interest = category[editIndex];
    const res = await api.put(`${API_URL}/${interest._id}`, { name: editValue.trim() });

    const updated = [...category];
    updated[editIndex] = res.data.data;
    setCategory(updated);

    setEditIndex(null);
    setEditValue("");
  };

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Category
        </Typography>
      </Box>

      {/* Add Category */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
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

      {/* Category List */}
      {category.length === 0 ? (
        <Typography color="text.secondary">No category added yet.</Typography>
      ) : (
        <Box sx={{ maxHeight:500, overflow: 'auto' }}>
          <List>
            {category.map((cat, index) => (
              <ListItem key={cat._id} divider>
                <ListItemText primary={cat.name} />
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
                    onClick={() => handleDelete(cat._id)}
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
        <DialogTitle>Edit Category</DialogTitle>
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
