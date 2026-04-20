import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendInvoiceEmail } from "@/app/apis/sendInvoiceEmail";

export const invoiceEmailThunk = createAsyncThunk(
    "invoiceEmail/send",
    async ({ orderNo, order_type = "regular" }, { rejectWithValue }) => {
        try {
            const res = await sendInvoiceEmail({ orderNo, order_type });
            if (res.status === 0) return rejectWithValue(res.message);
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Email sending failed"
            );
        }
    }
);

const invoiceEmailSlice = createSlice({
    name: "invoiceEmail",
    initialState: {
        loading: false,
        success: false,
        message: null,
        error: null,
    },
    reducers: {
        resetInvoiceEmail: (state) => {
            state.loading = false;
            state.success = false;
            state.message = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(invoiceEmailThunk.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(invoiceEmailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(invoiceEmailThunk.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

export const { resetInvoiceEmail } = invoiceEmailSlice.actions;
export default invoiceEmailSlice.reducer;