import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const CategoryCard = ({ title, imageUrl }) => {
  return (
    <Card
      sx={{
        width: { xs: "6rem", md: "16rem" },
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow for elevation
        transition: "transform 0.3s ease-in-out", // Add transition for hover effect
        "&:hover": {
          transform: "scale(1.05)", // Scale up on hover
        },
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          height="100%"
          loading="lazy"
          decoding="async"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              textAlign: "center",
              fontSize: {
                xs: "0.875rem",
                md: "1.125rem",
              },
              fontWeight: {
                xs: 600,
                md: 400,
              },
              textTransform: "capitalize",
              color: "var(--primary, #A10550)", // Text color
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
