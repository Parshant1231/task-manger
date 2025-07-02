export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // POST - Register a new user
    LOGIN: "/api/auth/login",       // POST - Login and get token
    GET_PROFILE: "/api/auth/profile", // GET - Fetch logged-in user
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // GET - Admin: all users
    GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`, // GET - One user
    CREATE_USER: "/api/users", // POST - Admin: create
    UPDATE_USER: (userId: string) => `/api/users/${userId}`, // PUT - Update
    DELETE_USER: (userId: string) => `/api/users/${userId}`, // DELETE - Delete
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // GET - Admin dashboard
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // GET - User dashboard
    GET_ALL_TASKS: "/api/tasks", // GET - All or assigned tasks
    GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`, // GET - One task
    CREATE_TASK: "/api/tasks", // POST - Admin create
    UPDATE_TASK: (taskId: string) => `/api/tasks/${taskId}`, // PUT - Update
    DELETE_TASK: (taskId: string) => `/api/tasks/${taskId}`, // DELETE - Delete
    UPDATE_TASK_STATUS: (taskId: string) => `/api/tasks/${taskId}/status`, // PATCH - Status
  UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/tasks/${taskId}/todo`, // PATCH - Checklist
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // GET - Export to Excel
    EXPORT_USERS: "/api/reports/export/users"  // Download user-task report
  },
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image"
  }
} as const;