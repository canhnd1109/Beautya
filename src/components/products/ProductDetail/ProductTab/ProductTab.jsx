import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DescriptionIcon from "@mui/icons-material/Description";
import Face2Icon from "@mui/icons-material/Face2";
import { Grid, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ProductTab({ product }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box
      sx={{ bgcolor: "background.paper", padding: "2rem", borderRadius: "8px" }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: "#F4F4F4", borderRadius: "8px" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            icon={<DescriptionIcon />}
            label="Chi Tiết Sản Phẩm"
            {...a11yProps(0)}
            sx={{
              fontSize: { xs: "0.875rem", md: "1.25rem" },
              fontWeight: 700,
              color: value === 0 ? "#A10550" : "#000",
            }}
          />
          <Tab
            icon={<ChecklistRtlIcon />}
            label="Cách Sử Dụng"
            {...a11yProps(1)}
            sx={{
              fontSize: { xs: "0.875rem", md: "1.25rem" },
              fontWeight: 700,
              color: value === 1 ? "#A10550" : "#000",
            }}
          />
          <Tab
            icon={<Face2Icon />}
            label="Thành Phần"
            {...a11yProps(2)}
            sx={{
              fontSize: { xs: "0.875rem", md: "1.25rem" },
              fontWeight: 700,
              color: value === 2 ? "#A10550" : "#000",
            }}
          />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Stack direction="column" alignItems="center">
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Mô tả:</strong> {product.description}
            </Typography>
          </Stack>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Stack direction="column" alignItems="center">
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Cách Sử Dụng:</strong>
            </Typography>
            {product.howToApply && (
              <ul>
                {product.howToApply.map((step, index) => (
                  <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                    <span role="img" aria-label="step">
                      🌸
                    </span>{" "}
                    {step}
                  </Typography>
                ))}
              </ul>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <Stack
            direction="column"
            alignItems="center"
            marginInline={{ xs: 2, md: 6 }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Thành Phần:</strong>
            </Typography>
            {product.ingredients && (
              <Grid container spacing={2}>
                {product.ingredients.map((ingredient, index) => (
                  <Grid item xs={4} key={index}>
                    {" "}
                    <Typography variant="body2">
                      <span role="img" aria-label="ingredient">
                        🍀
                      </span>{" "}
                      {ingredient}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
