const express = require("express");

const app = express();

const TOKENTAG = "taskapp_";

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Todo 1",
    description: "This is my first Todo",
    isCompleted: true,
    dueDate: "24/11/2023",
  },

  {
    id: 2,
    title: "Todo 2",
    description: "This is my second Todo",
    isCompleted: true,
    dueDate: "24/11/2023",
  },

  {
    id: 3,
    title: "Todo 3",
    description: "This is my third Todo",
    isCompleted: true,
    dueDate: "24/11/2023",
  },

  {
    id: 4,
    title: "Todo 4",
    description: "This is my fourth Todo",
    isCompleted: false,
    dueDate: "25/11/2023",
  },

  {
    id: 5,
    title: "Todo 5",
    description: "This is my fifth Todo",
    isCompleted: false,
    dueDate: "25/11/2023",
  },
];

const users = [];

app.use("/tasks", function (request, response, next) {
  const token = request?.headers?.authorization;

  if (!token && !token?.includes(TOKENTAG))
    return response.status(401).end("unauthorized");

  next();
});

app.post("/tasks", function (request, response) {
  // Perform the creation of tasks
  const task = request.body;

  const id = Math.floor(Math.random() * 100) + 1;
  tasks.push({
    id,
    ...task,
  });

  return response
    .status(201)
    .json({ success: true, message: "Task created successfully", task });
});

app.get("/tasks", function (request, response) {
  // Retrieve all the tasks

  response.status(200).json({
    success: true,
    message: "Task retrieved successfully",
    tasks,
  });
});

app.get("/tasks/:id", function (request, response) {
  // Retrieve a single task with ID
  const id = request.params?.id;
  const task = tasks.find(function (task) {
    return task.id == id;
  });

  if (!task)
    return response.status(404).json({
      success: false,
      message: `Task with ID: ${id} not found`,
    });

  response.status(200).json({
    success: true,
    message: `Task with ID: ${id} retrieved successfully`,
    task,
  });
});

app.put("/tasks/:id", function (request, response) {
  // Updates a particular Task
  const id = parseInt(request.params?.id);

  if (!id)
    return response.status(404).json({
      success: false,
      message: `ID must be passed`,
    });

  // Validation
  const { title, description, dueDate, isCompleted } = request.body;
  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (dueDate) updateData.dueDate = dueDate;
  if (isCompleted) updateData.isCompleted = isCompleted;

  //  Update the task
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1)
    return response.status(404).json({
      success: false,
      message: `Task with ID: ${id} not found`,
    });

  const task = (tasks[taskIndex] = { ...tasks[taskIndex], ...updateData });

  response.status(200).json({
    success: true,
    message: `Task with ID: ${id} updated successfully`,
    task,
  });
});

app.patch("/tasks/:id/status", function (request, response) {
  // Updates a particular Task Status
  const id = parseInt(request.params?.id);

  if (!id)
    return response.status(404).json({
      success: false,
      message: `ID must be passed`,
    });

  // Validation
  const { isCompleted } = request.body;
  const updateData = {};
  if (isCompleted) updateData.isCompleted = isCompleted;

  //  Update the task
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1)
    return response.status(404).json({
      success: false,
      message: `Task with ID: ${id} not found`,
    });

  const task = (tasks[taskIndex] = { ...tasks[taskIndex], ...updateData });

  response.status(200).json({
    success: true,
    message: `Task with ID: ${id} updated successfully`,
    task,
  });
});

app.delete("/tasks/:id", function (request, response) {
  // Delete a particular Task
  const id = parseInt(request.params?.id);

  tasks = tasks.filter((task) => task.id !== id);
  response
    .status(200)
    .json({ success: true, message: "Task deleted successfully" });
});

app.post("/login", function (request, response) {
  const { email, password } = request.body;

  const user = users.find((user) => user.email === email);

  if (!user || user?.password !== password)
    return response.status(401).json({
      success: false,
      message: `Wrong password and email combination`,
    });

  // Token generation
  let randomString = (Math.random() + 1).toString(36).substring(7);
  const token = `${TOKENTAG}${randomString}`;

  return response.status(200).json({
    success: true,
    message: `User login successfully`,
    token,
    user,
  });
});

app.post("/register", function (request, response) {
  const id = Math.floor(Math.random() * 100) + 1;

  //   Validation
  const { email, password, name } = request.body;

  if (!email || !password)
    return response.status(422).json({
      success: false,
      message: `Email and Password is required`,
    });

  users.push({
    id,
    email,
    password,
    name,
  });

  response.status(201).json({
    success: true,
    message: `User created successfully`,
    user: { email, password, name, id },
  });
});

app.listen(8081, function () {
  console.log(`Example app listening at https://localhost:8081`);
});
