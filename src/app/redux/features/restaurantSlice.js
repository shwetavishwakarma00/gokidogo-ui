import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurantApi } from "@/app/apis/restaurantApi";

export const fetchRestaurantMenu = createAsyncThunk(
  "restaurant/fetchRestaurantMenu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchRestaurantApi({
        restaurantid: 20,
      });

      const res = response; 

      const categoryMap = {};

      res.menu?.forEach((item) => {
        const category = item.menu_head || "Other";

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_id: category,
            category: category,
            category_products: [],
          };
        }

        categoryMap[category].category_products.push({
          ...item,
          mnuid: item.sku,
        });
      });

      return {
        restaurantInfo: res.restaurant,
        categories: Object.values(categoryMap),
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",

  initialState: {
    restaurantInfo: null,
    categories: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantInfo = action.payload.restaurantInfo;
        state.categories = action.payload.categories;
      })

      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default restaurantSlice.reducer;