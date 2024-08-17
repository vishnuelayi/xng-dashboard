import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../store';  // Import RootState from your store
import { AppConfigurationClient } from "@azure/app-configuration";

interface FeatureFlagsState {
  flags: Record<string, boolean>;
}

const initialState: FeatureFlagsState = {
  flags: {},
};

export const initializeFeatureFlags = createAsyncThunk("featureFlags/fetch", async (_, { getState }) => {
  try {
    // console.log('Starting initializeFeatureFlags...')
    const stateInUs = (getState() as RootState).stateInUs;  // Access stateInUs from the state
    // console.log('stateInUs:', stateInUs)
    var connectionString;
    switch (stateInUs) {
      case "TX":
        connectionString = process.env.REACT_APP_CONFIG_CONNECTION_STRING_TX;
        // console.log('TX CONNECTION')
        break;
      case "NH":
        connectionString = process.env.REACT_APP_CONFIG_CONNECTION_STRING_NH;
        // console.log('NH CONNECTION')
        break;
      default:
        connectionString = process.env.REACT_APP_CONFIG_CONNECTION_STRING_TX;
        // console.log('DEFAULT CONNECTION')
        break;
    }
    // console.log('creating app config client...')
    const AppConfigClient = new AppConfigurationClient(connectionString!);
    // console.log('getting settings...')
    const settingsIterator = AppConfigClient.listConfigurationSettings({ keyFilter: ".appconfig.featureflag/*" });
    // console.log('iterating settings...')
    const flags: Record<string, boolean> = {};
    for await (const setting of settingsIterator) {
      const valueObject = JSON.parse(setting.value!);
      const key = setting.key.replace('.appconfig.featureflag/', '');
      flags[key] = valueObject.enabled;
    }
    // console.log('flags:', flags)
    return flags;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
});

export const featureFlagsSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeFeatureFlags.pending, (state) => {
        // console.log('Fetching feature flags...');
      })
      .addCase(initializeFeatureFlags.fulfilled, (state, action: PayloadAction<Record<string, boolean>>) => {
        state.flags = action.payload;
      })
      .addCase(initializeFeatureFlags.rejected, (state, action) => {
        console.error('Failed to fetch feature flags:', action.error);
      });
  },
});

export default featureFlagsSlice.reducer;