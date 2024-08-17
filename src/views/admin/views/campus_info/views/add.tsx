import { XNGBack } from "../../../../../design";
import { useContext } from "react";
import { CampusInformationContext } from "../campus_info";
import { useForm, Controller } from "react-hook-form";
import { Box, TextField, Grid, Button, Typography } from "@mui/material";

const FORM_GAP_REM = "1rem";

type FormData = {
  campusName: string;
  stateId: string;
  weeklyHours: string;
  address: string;
  city: string;
  zipCode: string;
  contactRole: string;
  phone: string;
  fax: string;
};

export default function CampusInformationAddView() {
  const { setSelectedSlide } = useContext(CampusInformationContext);

  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  function handleBack() {
    setSelectedSlide(0);
  }

  return (
    <Box sx={{ display: "flex", gap: "2rem", flexDirection: "column", alignItems: "flex-start" }}>
      <XNGBack onClick={() => handleBack()} />

      <Typography variant="h6">Add Campus</Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          overflowY: "auto",
          maxHeight: "calc(100vh - 28rem)",
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          sx={{
            width: "30rem",
            display: "flex",
            flexDirection: "column",
            gap: FORM_GAP_REM,
          }}
        >
          <Controller
            name="campusName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Campus Name" placeholder="Enter Campus Name" fullWidth />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="stateId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="State ID" placeholder="Enter State ID" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="weeklyHours"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Weekly Hours" placeholder="00.00" fullWidth />
                )}
              />
            </Grid>
          </Grid>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Address" placeholder="Enter Address" fullWidth />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="City" placeholder="Enter City" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="zipCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Zip Code" placeholder="Enter Zip Code" fullWidth />
                )}
              />
            </Grid>
          </Grid>
          <Controller
            name="contactRole"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Contact Role" placeholder="Enter Role" fullWidth />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="phone"
                control={control}
                defaultValue="+1 555 555-5555"
                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="fax"
                control={control}
                defaultValue="+1 555 555-5556"
                render={({ field }) => <TextField {...field} label="Fax" fullWidth />}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: FORM_GAP_REM }}>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
            <Button variant="outlined" onClick={() => handleBack()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
