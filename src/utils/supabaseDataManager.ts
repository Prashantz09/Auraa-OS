// Supabase-based Data Management for Team Collaboration
// This ensures all users see the same data while maintaining admin controls

import { supabase, Database } from '../lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type Client = Database['public']['Tables']['clients']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type ActivityLog = Database['public']['Tables']['activity_logs']['Row']

class SupabaseDataManager {
  // User Management
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async addUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()
    
    if (error) throw error
    await this.logActivity('created', 'user', data.id, `Created user: ${data.name}`)
    return data
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    if (data) {
      await this.logActivity('updated', 'user', userId, `Updated user: ${data.name}`)
    }
    return data
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const currentUser = await this.getCurrentUser()
    if (currentUser?.id === userId) {
      throw new Error("Cannot delete your own account")
    }
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    
    if (error) throw error
    await this.logActivity('deleted', 'user', userId, `Deleted user`)
    return true
  }

  // Client Management
  static async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async addClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    
    if (error) throw error
    await this.logActivity('created', 'client', data.id, `Created client: ${data.name}`)
    return data
  }

  static async updateClient(clientId: string, updates: Partial<Client>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single()
    
    if (error) throw error
    if (data) {
      await this.logActivity('updated', 'client', clientId, `Updated client: ${data.name}`)
    }
    return data
  }

  static async deleteClient(clientId: string): Promise<boolean> {
    const currentUser = await this.getCurrentUser()
    const client = await this.getClientById(clientId)
    
    if (!client) return false
    
    // Check permissions - only admin or creator can delete
    if (currentUser?.role !== 'admin' && client.created_by !== currentUser?.id) {
      throw new Error("Only admin or the creator can delete this client")
    }
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
    
    if (error) throw error
    await this.logActivity('deleted', 'client', clientId, `Deleted client: ${client.name}`)
    return true
  }

  static async getClientById(clientId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  // Project Management
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()
    
    if (error) throw error
    await this.logActivity('created', 'project', data.id, `Created project: ${data.title}`)
    return data
  }

  static async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    if (data) {
      await this.logActivity('updated', 'project', projectId, `Updated project: ${data.title}`)
    }
    return data
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    const currentUser = await this.getCurrentUser()
    const project = await this.getProjectById(projectId)
    
    if (!project) return false
    
    // Check permissions - only admin or creator can delete
    if (currentUser?.role !== 'admin' && project.created_by !== currentUser?.id) {
      throw new Error("Only admin or the creator can delete this project")
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
    await this.logActivity('deleted', 'project', projectId, `Deleted project: ${project.title}`)
    return true
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  // Activity Logging
  static async getActivityLog(): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)
    
    if (error) throw error
    return data || []
  }

  static async logActivity(action: string, targetType: string, targetId: string, details: string): Promise<void> {
    const currentUser = await this.getCurrentUser()
    if (!currentUser) return
    
    const logEntry = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      action,
      target: details,
      target_type: targetType as 'client' | 'project' | 'user',
      target_id: targetId,
      details
    }
    
    const { error } = await supabase
      .from('activity_logs')
      .insert([logEntry])
    
    if (error) console.error('Error logging activity:', error)
  }

  // Authentication
  static async signIn(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) throw authError

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) throw userError
    if (!userData) throw new Error('User profile not found')

    return userData
  }

  static async signUp(email: string, password: string, name: string, role: 'admin' | 'editor' | 'viewer' = 'editor'): Promise<User> {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) throw authError

    // Create user profile
    const newUser = {
      name,
      email,
      role,
      status: 'active' as const,
      avatar: name.charAt(0).toUpperCase()
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single()

    if (userError) throw userError
    return userData
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return null

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (error) return null
    return userData
  }

  // Permission Checks
  static async canEdit(targetType: 'client' | 'project' | 'user', target?: any): Promise<boolean> {
    const currentUser = await this.getCurrentUser()
    if (!currentUser) return false
    
    // Admin can edit everything
    if (currentUser.role === 'admin') return true
    
    // Editors can edit clients and projects
    if (currentUser.role === 'editor' && targetType !== 'user') return true
    
    // Viewers can only view
    return false
  }

  static async canDelete(targetType: 'client' | 'project' | 'user', target?: any): Promise<boolean> {
    const currentUser = await this.getCurrentUser()
    if (!currentUser) return false
    
    // Admin can delete everything
    if (currentUser.role === 'admin') return true
    
    // Others can only delete their own creations
    if (target && target.created_by === currentUser.id) return true
    
    return false
  }

  // Real-time subscriptions
  static subscribeToClients(callback: (clients: Client[]) => void) {
    return supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' },
        async () => {
          const clients = await this.getClients()
          callback(clients)
        }
      )
      .subscribe()
  }

  static subscribeToProjects(callback: (projects: Project[]) => void) {
    return supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const projects = await this.getProjects()
          callback(projects)
        }
      )
      .subscribe()
  }

  static subscribeToUsers(callback: (users: User[]) => void) {
    return supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        async () => {
          const users = await this.getUsers()
          callback(users)
        }
      )
      .subscribe()
  }

  // Utility
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static initializeDefaultData(): void {
    // Default data is now handled by the database schema
    // The admin user is created in the SQL schema
  }
}

export default SupabaseDataManager
