// app/redux/features/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const EMPTY = { date: "", people: "", budget: "" };

const loadBooking = () => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const saved = localStorage.getItem("booking");
    return saved ? JSON.parse(saved) : EMPTY;
  } catch {
    return EMPTY;
  }
};

const saveBooking = (state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("booking", JSON.stringify({
      date: state.date,
      people: state.people,
      budget: state.budget,
    }));
  }
};

const bookingSlice = createSlice({
  name: "booking",
  initialState: loadBooking(),
  reducers: {
    setBooking: (state, action) => {
      const { date, people, budget } = action.payload;
      if (date !== undefined) state.date = date;
      if (people !== undefined) state.people = people;
      if (budget !== undefined) state.budget = budget;
      saveBooking(state);
    },
    clearBooking: (state) => {
      state.date = "";
      state.people = "";
      state.budget = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("booking");
      }
    },
  },
});

export const { setBooking, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;