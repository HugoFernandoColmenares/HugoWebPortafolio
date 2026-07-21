export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage extends ContactMessageInput {
  id: string;
  created_at: string;
}
