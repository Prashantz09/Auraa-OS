// Centralized Data Management for Team Collaboration
// This ensures all users see the same data while maintaining admin controls

interface User {
  id: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  email?: string;
  status: "active" | "inactive";
  avatar: string;
  createdAt?: string;
  createdBy?: string;
}

interface Client {
  id: string;
  name: string;
  status: "Active" | "Inactive" | "Pending";
  activity: string;
  monthlyProjects: number;
  thisMonthProjects: Array<{
    id: number;
    title: string;
    date: string;
    service: string;
  }>;
  totalProjects: number;
  clientSince: string;
  priority: "High" | "Medium" | "Low";
  budget: "Premium" | "Standard" | "Basic";
  image?: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  modifiedBy: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
  status: "planning" | "in-progress" | "review" | "completed";
  priority: "high" | "medium" | "low";
  deadline: string;
  description: string;
  progress: number;
  team: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  modifiedBy: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetType: "client" | "project" | "user";
  targetId: string;
  timestamp: string;
  details?: string;
}

class DataManager {
  private static readonly STORAGE_KEYS = {
    USERS: "auraa-users",
    CLIENTS: "auraa-clients",
    PROJECTS: "auraa-projects",
    ACTIVITY_LOG: "auraa-activity-log",
    CURRENT_USER: "auraa_user",
  };

  // User Management
  static getUsers(): User[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static addUser(user: Omit<User, "id">): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()?.id || "system",
    };
    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);
    this.logActivity(
      "created",
      "user",
      newUser.id,
      `Created user: ${newUser.name}`,
    );
    return newUser;
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...updates,
      lastModified: new Date().toISOString(),
      modifiedBy: this.getCurrentUser()?.id || "system",
    };
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    this.saveUsers(updatedUsers);
    this.logActivity(
      "updated",
      "user",
      userId,
      `Updated user: ${updatedUser.name}`,
    );
    return updatedUser;
  }

  static deleteUser(userId: string): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId) {
      throw new Error("Cannot delete your own account");
    }

    const users = this.getUsers();
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return false;

    const updatedUsers = users.filter((u) => u.id !== userId);
    this.saveUsers(updatedUsers);
    this.logActivity(
      "deleted",
      "user",
      userId,
      `Deleted user: ${userToDelete.name}`,
    );
    return true;
  }

  // Client Management
  static getClients(): Client[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  }

  static saveClients(clients: Client[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  static addClient(
    client: Omit<
      Client,
      "id" | "createdBy" | "createdAt" | "lastModified" | "modifiedBy"
    >,
  ): Client {
    const currentUser = this.getCurrentUser();
    const clients = this.getClients();
    const newClient: Client = {
      ...client,
      id: this.generateId(),
      createdBy: currentUser?.id || "unknown",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: currentUser?.id || "unknown",
    };
    const updatedClients = [...clients, newClient];
    this.saveClients(updatedClients);
    this.logActivity(
      "created",
      "client",
      newClient.id,
      `Created client: ${newClient.name}`,
    );
    return newClient;
  }

  static updateClient(
    clientId: string,
    updates: Partial<Client>,
  ): Client | null {
    const currentUser = this.getCurrentUser();
    const clients = this.getClients();
    const index = clients.findIndex((c) => c.id === clientId);
    if (index === -1) return null;

    const updatedClient = {
      ...clients[index],
      ...updates,
      lastModified: new Date().toISOString(),
      modifiedBy: currentUser?.id || "unknown",
    };
    const updatedClients = [...clients];
    updatedClients[index] = updatedClient;
    this.saveClients(updatedClients);
    this.logActivity(
      "updated",
      "client",
      clientId,
      `Updated client: ${updatedClient.name}`,
    );
    return updatedClient;
  }

  static deleteClient(clientId: string): boolean {
    const currentUser = this.getCurrentUser();
    const clients = this.getClients();
    const clientToDelete = clients.find((c) => c.id === clientId);
    if (!clientToDelete) return false;

    // Check permissions - only admin or creator can delete
    if (
      currentUser?.role !== "admin" &&
      clientToDelete.createdBy !== currentUser?.id
    ) {
      throw new Error("Only admin or the creator can delete this client");
    }

    const updatedClients = clients.filter((c) => c.id !== clientId);
    this.saveClients(updatedClients);
    this.logActivity(
      "deleted",
      "client",
      clientId,
      `Deleted client: ${clientToDelete.name}`,
    );
    return true;
  }

  // Project Management
  static getProjects(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  static addProject(
    project: Omit<
      Project,
      "id" | "createdBy" | "createdAt" | "lastModified" | "modifiedBy"
    >,
  ): Project {
    const currentUser = this.getCurrentUser();
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      createdBy: currentUser?.id || "unknown",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: currentUser?.id || "unknown",
    };
    const updatedProjects = [...projects, newProject];
    this.saveProjects(updatedProjects);
    this.logActivity(
      "created",
      "project",
      newProject.id,
      `Created project: ${newProject.title}`,
    );
    return newProject;
  }

  static updateProject(
    projectId: string,
    updates: Partial<Project>,
  ): Project | null {
    const currentUser = this.getCurrentUser();
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) return null;

    const updatedProject = {
      ...projects[index],
      ...updates,
      lastModified: new Date().toISOString(),
      modifiedBy: currentUser?.id || "unknown",
    };
    const updatedProjects = [...projects];
    updatedProjects[index] = updatedProject;
    this.saveProjects(updatedProjects);
    this.logActivity(
      "updated",
      "project",
      projectId,
      `Updated project: ${updatedProject.title}`,
    );
    return updatedProject;
  }

  static deleteProject(projectId: string): boolean {
    const currentUser = this.getCurrentUser();
    const projects = this.getProjects();
    const projectToDelete = projects.find((p) => p.id === projectId);
    if (!projectToDelete) return false;

    // Check permissions - only admin or creator can delete
    if (
      currentUser?.role !== "admin" &&
      projectToDelete.createdBy !== currentUser?.id
    ) {
      throw new Error("Only admin or the creator can delete this project");
    }

    const updatedProjects = projects.filter((p) => p.id !== projectId);
    this.saveProjects(updatedProjects);
    this.logActivity(
      "deleted",
      "project",
      projectId,
      `Deleted project: ${projectToDelete.title}`,
    );
    return true;
  }

  // Activity Logging
  static getActivityLog(): ActivityLog[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_LOG);
    return data ? JSON.parse(data) : [];
  }

  static logActivity(
    action: string,
    targetType: string,
    targetId: string,
    details: string,
  ): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const logEntry: ActivityLog = {
      id: this.generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      target: details,
      targetType: targetType as any,
      targetId,
      timestamp: new Date().toISOString(),
      details,
    };

    const logs = this.getActivityLog();
    const updatedLogs = [logEntry, ...logs].slice(0, 1000); // Keep last 1000 activities
    localStorage.setItem(
      this.STORAGE_KEYS.ACTIVITY_LOG,
      JSON.stringify(updatedLogs),
    );
  }

  // Current User Management
  static getCurrentUser(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  // Permission Checks
  static canEdit(
    targetType: "client" | "project" | "user",
    target?: any,
  ): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Admin can edit everything
    if (currentUser.role === "admin") return true;

    // Editors can edit clients and projects
    if (currentUser.role === "editor" && targetType !== "user") return true;

    // Viewers can only view
    return false;
  }

  static canDelete(
    targetType: "client" | "project" | "user",
    target?: any,
  ): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Admin can delete everything
    if (currentUser.role === "admin") return true;

    // Others can only delete their own creations
    if (target && target.createdBy === currentUser.id) return true;

    return false;
  }

  // Utility
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static initializeDefaultData(): void {
    // Initialize with default admin if no users exist
    if (this.getUsers().length === 0) {
      const defaultAdmin: User = {
        id: "prash",
        name: "Prash",
        role: "admin",
        email: "prash@auraa.com",
        status: "active",
        avatar: "P",
        createdAt: new Date().toISOString(),
      };
      this.saveUsers([defaultAdmin]);
    }
  }
}

export default DataManager;
