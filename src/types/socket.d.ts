// src/types/socket.d.ts

import { Socket } from "socket.io";

// Extend Socket type to include `user` property
declare module "socket.io" {
  interface Socket {
    user: {
      id: string; // or whatever type your userId is
      // Include other properties from your JWT payload as needed
    };
  }
}
