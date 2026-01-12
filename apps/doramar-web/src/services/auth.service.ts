import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  type Auth,
  type User,
  type UserCredential,
} from "firebase/auth"

export class AuthService {
  private readonly firebaseAuth: Auth

  constructor(firebaseAuth: Auth) {
    this.firebaseAuth = firebaseAuth
  }

  get currentUser(): User | null {
    return this.firebaseAuth.currentUser
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.firebaseAuth, callback)
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.firebaseAuth, email, password)
  }

  async signOut(): Promise<void> {
    return signOut(this.firebaseAuth)
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email)
  }

  async deleteAccount(email: string, password: string): Promise<void> {
    if (!this.currentUser) return
    const credential = EmailAuthProvider.credential(email, password)
    await reauthenticateWithCredential(this.currentUser, credential)
    await deleteUser(this.currentUser)
    await this.signOut()
  }

  async resetPasswordFromCurrentPassword(
    currentPassword: string,
    newPassword: string,
    email: string,
  ): Promise<void> {
    if (!this.currentUser) return
    const credential = EmailAuthProvider.credential(email, currentPassword)
    await reauthenticateWithCredential(this.currentUser, credential)
    await updatePassword(this.currentUser, newPassword)
  }

  async getFirebaseIdToken(): Promise<string | null> {
    return this.currentUser ? this.currentUser.getIdToken() : null
  }
}
