import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { validateForm } from '../../checkoutActions';
import type { StripeErrorPayload } from './state';
import { initialStripeCardState } from './state';
import { getStripeSetupIntent } from './thunks';

export const stripeCardSlice = createSlice({
	name: 'stripeCard',
	initialState: initialStripeCardState,
	reducers: {
		setStripeFieldsCompleted: (state, action: PayloadAction<boolean>) => {
			state.formComplete = action.payload;
		},
		setClientSecret(state, action: PayloadAction<string>) {
			state.setupIntentClientSecret = action.payload;
		},
		setStripePaymentMethod(state, action: PayloadAction<string | undefined>) {
			state.stripePaymentMethod = action.payload;
		},
		setStripeFormError(state, action: PayloadAction<StripeErrorPayload>) {
			state.errors[action.payload.field] = action.payload.error;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStripeSetupIntent.fulfilled, (state, action) => {
			state.setupIntentClientSecret = action.payload;
		});

		builder.addCase(validateForm, (state) => {
			state.showErrors = true;
		});
	},
});

export const stripeCardReducer = stripeCardSlice.reducer;
