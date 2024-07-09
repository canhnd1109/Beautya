import Stack from "@mui/material/Stack";
import CategoryCard from "components/common/CategoryCard/CategoryCard";
import { Link } from "react-router-dom";
import Section from "../Section/Section";

const categories = [
  {
    path: "/makeup",
    title: "Makeup",
    imageUrl: "/assets/images/category/women-makeup.webp",
  },
  {
    path: "/skincare",
    title: "Skincare",
    imageUrl: "/assets/images/category/women-skincare.webp",
  },
  {
    path: "/gifts-and-sets",
    title: "Gifts and sets",
    imageUrl: "/assets/images/category/gifts-and-sets.webp",
  },
];

const CategorySection = () => {
  return (
    <Section title={"Danh mục sản phẩm"}>
      <Stack direction="row" spacing="3rem">
        {categories.map((category, index) => (
          <Link key={index} to={category.path}>
            <CategoryCard title={category.title} imageUrl={category.imageUrl} />
          </Link>
        ))}
      </Stack>
    </Section>
  );
};

export default CategorySection;
