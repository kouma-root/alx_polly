export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  authorId: string
  author: User
}

export interface PollOption {
  id: string
  text: string
  votes: number
  pollId: string
}

export interface Vote {
  id: string
  pollId: string
  optionId: string
  userId: string
  createdAt: string
}

export interface CreatePollData {
  title: string
  description: string
  options: string[]
}

export interface EditPollData {
  id: string
  title: string
  description: string
  options: EditPollOption[]
  isActive: boolean
}

export interface EditPollOption {
  id?: string // Optional for new options
  text: string
  pollId?: string // Optional for new options
  isNew?: boolean // Flag to identify newly added options
  isDeleted?: boolean // Flag to mark options for deletion
}

export interface UpdatePollData {
  title: string
  description: string
  options: EditPollOption[]
  isActive: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
