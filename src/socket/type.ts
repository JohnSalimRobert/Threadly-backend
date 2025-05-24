import {  Socket } from "socket.io";

export interface authSocket extends Socket {
  data: {
    user:{
      id: string;
    } // or whatever type your userId is
    // Include other properties from your JWT payload as needed
  };
}