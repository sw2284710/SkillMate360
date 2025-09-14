import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";

import { Iconify } from "src/components/iconify";

const API_URL = `${import.meta.env.VITE_API_URL}`;

interface CourseTableProps {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (id: string) => void;
}


export function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Lessons</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>
                {course.thumbnail && (
                  <Box
                    component="img"
                    src={API_URL+course.thumbnail}
                    alt={course.title}
                    sx={{ width: 60, height: 60, borderRadius: 1 }}
                  />
                )}
              </TableCell>

              <TableCell>
                <Typography fontWeight="bold">{course.title}</Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={course.category?.name || "Uncategorized"}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {course.description}
                </Typography>
              </TableCell>

              <TableCell>₹{course.price}</TableCell>
              <TableCell>₹{course.discountPrice}</TableCell>
              <TableCell>{course.lessonsCount}</TableCell>

              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(course._id)}>
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(course._id)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {courses.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No courses available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
