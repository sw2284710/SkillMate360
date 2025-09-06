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

const API_URL = "http://localhost:5000/interests";

export function ControlPanelView() {
  const [interests, setInterests] = useState<any[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch interests from DB
  useEffect(() => {
    api.get(API_URL).then((res) => setInterests(res.data.data));
  }, []);

  // Add new interest
  const handleAdd = async () => {
    if (newInterest.trim() === "") return;
    const res = await api.post(API_URL, { name: newInterest.trim() });
    setInterests([ res.data.data, ...interests]);
    setNewInterest("");
  };

  // Delete interest
  const handleDelete = async (id: string) => {
    await api.delete(`${API_URL}/${id}`);
    setInterests(interests.filter((i) => i._id !== id));
  };

  // Open edit dialog
  const handleEditOpen = (index: number) => {
    setEditIndex(index);
    setEditValue(interests[index].name);
  };

  // Save edited interest
  const handleEditSave = async () => {
    if (editIndex === null) return;
    const interest = interests[editIndex];
    const res = await api.put(`${API_URL}/${interest._id}`, { name: editValue.trim() });

    const updated = [...interests];
    updated[editIndex] = res.data.data;
    setInterests(updated);

    setEditIndex(null);
    setEditValue("");
  };

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Control Panel - Interests
        </Typography>
      </Box>

      {/* Add Interest */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter Interest"
          variant="outlined"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
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
      {interests.length === 0 ? (
        <Typography color="text.secondary">No interests added yet.</Typography>
      ) : (
        <Box sx={{ maxHeight:500, overflow: 'auto' }}>
          <List>
            {interests.map((interest, index) => (
              <ListItem key={interest._id} divider>
                <ListItemText primary={interest.name} />
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
                    onClick={() => handleDelete(interest._id)}
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
        <DialogTitle>Edit Interest</DialogTitle>
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
