import { React, useState} from "react";
import { auth } from '../config/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const Auth =  () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const createUser = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <input
          type="text"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />

        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}