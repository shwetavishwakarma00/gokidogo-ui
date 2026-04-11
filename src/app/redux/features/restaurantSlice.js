import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurantApi } from "@/app/apis/restaurantApi";

export const fetchRestaurant = createAsyncThunk(
  "restaurant/fetchRestaurant",
  async () => {
    const data = await fetchRestaurantApi();
    return data;
  },
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    restaurantInfo: null,
    restaurantId: null,
    categories: [],
    deliveryHours: [],
    zipcodes: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurant.fulfilled, (state, action) => {
  state.loading = false;
  const payload = action.payload[0];
  state.restaurantInfo = payload.Restaurant_Detail[0];
  state.restaurantId = payload.Restaurant_Detail[0]?.restroid || "20"; 
  state.categories = payload.MenuItem.MenuHead;
  state.deliveryHours = payload.hours;
  state.zipcodes = payload.Zipcodes;
})
  },
});

export default restaurantSlice.reducer;
