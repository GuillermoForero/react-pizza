import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;
    return { position, address };
  }
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
  },
  extraReducers: (builder) =>
        builder
          .addCase(fetchAddress.pending, (state, action) => {
            state.status = 'loading';
          })
          .addCase(fetchAddress.fulfilled, (state, action) => {
            state.position = action.payload.position;
            state.address = action.payload.address;
            state.status = 'idle';
          })
          .addCase(fetchAddress.rejected, (state, action) => {
            state.status = 'error';
            state.error =
              'There was a problem getting your address. Make sure to fill this field!';
          }),
  selectors: {
    selectUsername: (state) => state.username,
    selectAddress: (state) => state.address,
    selectPosition: (state) => state.position,
    selectError: (state) => state.error,
    selectStatus: (state) => state.status,
  },
});

export const { updateName, setAddress } = userSlice.actions;

export const { selectUsername, selectAddress, selectPosition, selectError, selectStatus } = userSlice.selectors;

export default userSlice.reducer;
