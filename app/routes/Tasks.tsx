import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTaskStore } from "~/store/taskStore";
import type { Task } from "~/types";
// Define the form data interface for type safety with React Hook Form
interface FormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

const Tasks: React.FC = () => {
  // --- Connect to Zustand Store ---
  // Get the tasks state and the actions from the store
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [filter, setFilter] = React.useState("all");

  // --- React Hook Form Setup ---
  // Initialize useForm with the default values and destructure the necessary methods
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // Function to handle form submission
  const onSubmit = (data: FormData) => {
    addTask(data); // Call the addTask action from the store
    reset(); // Reset the form fields after submission
    setOpenDialog(false); // Close the dialog
  };

  // --- Implement Filtering Logic ---
  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "high") return task.priority === "high";
    return true; // 'all'
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            reset(); // Reset form when opening the dialog
            setOpenDialog(true);
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FilterList />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {filteredTasks.length} tasks
          </Typography>
        </Box>
      </Paper>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          {/* <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Add Your First Task
          </Button> */}
        </Paper>
      ) : (
        <Box>
          {filteredTasks.map((task: Task) => (
            <Card key={task.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Checkbox */}
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)} // Connect to toggleTask action
                  />

                  {/* Task Content */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {task.title}
                    </Typography>

                    {task.description && (
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    )}

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === "high"
                            ? "error"
                            : task.priority === "medium"
                              ? "warning"
                              : "default"
                        }
                      />
                    </Box>
                  </Box>

                  {/* Delete Button */}
                  <IconButton
                    color="error"
                    onClick={() => deleteTask(task.id)} // Connect to deleteTask action
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add Task Dialog */}
      {/* Use handleSubmit to trigger form validation and submission */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>Add New Task</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              {/* Connect TextField with React Hook Form using register and add validation */}
              <TextField
                fullWidth
                label="Task Title"
                variant="outlined"
                required
                {...register("title", { required: "กรุณากรอกชื่อ task" })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid size={12}>
              {/* Connect TextField with React Hook Form for description */}
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                {...register("description")}
              />
            </Grid>
            <Grid size={12}>
              {/* Connect Select with React Hook Form and add validation */}
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  defaultValue="medium"
                  {...register("priority", { required: "กรุณาเลือก priority" })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 2, mt: 0.5 }}
                >
                  {errors.priority?.message}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            type="submit" // Set type to submit to trigger the form submission
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;
