import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Calendar, Clock, Users, X, Edit2, Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { GoogleMeeting } from "../component/GoogleMeeting";

export const Home = () => {
  

  return (
    <>
      <GoogleMeeting/>
    </>
  );
};