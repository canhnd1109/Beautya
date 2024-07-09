import Layout from 'components/common/Layout/Layout';
import BestCategorySection from 'components/homepage/BestCategorySection/BestCategorySection';
import BestSellerSection from 'components/homepage/BestSellerSection/BestSellerSection';
import CategorySection from 'components/homepage/CategorySection/CategorySection';
import HeroSection from 'components/homepage/HeroSection/HeroSection';
import OurBrandSection from 'components/homepage/OurBrandSection/OurBrandSection';
import { CATEGORY } from 'utils/constants';

const HomePage = () => {
    return (
        <Layout>
            <HeroSection />
            <CategorySection />
            <BestSellerSection />
            <BestCategorySection category={CATEGORY.MAKE_UP} />
            <BestCategorySection category={CATEGORY.SKINCARE} />
            <BestCategorySection category={CATEGORY.GIFTS_AND_SETS} />
            <OurBrandSection />
        </Layout>
    );
};

export default HomePage;
