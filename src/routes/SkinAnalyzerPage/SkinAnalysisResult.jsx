import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CATEGORY_PATH, SKIN_ANALYSIS_LABEL } from 'utils/constants';

const SkinAnalysisResult = ({ result }) => {
    // Helper function to get the description based on the value
    const getDescription = (key, value) => {
        switch (key) {
            case SKIN_ANALYSIS_LABEL.eye_pouch:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không có bọng mắt</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Chú ý! Có vấn đề với bọng mắt của bạn. Hãy khám phá các sản phẩm chăm sóc da của
                                    chúng tôi để cải thiện tình trạng này.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.dark_circle:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không có quầng thâm</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Phát hiện quầng thâm mắt. Hãy khám phá ngay sản phẩm chăm sóc da chuyên sâu để giảm
                                    quầng thâm và làm tươi mới đôi mắt của bạn.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.forehead_wrinkle:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không nếp nhăn trán</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Oops! Nếp nhăn trán đã xuất hiện. Hãy khám phá ngay các sản phẩm chăm sóc da chống
                                    lão hóa để giảm nếp nhăn và giữ cho làn da trán của bạn trông trẻ trung hơn.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.crows_feet:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không có vết chân chim</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Uh oh! Có vẻ đây là vết chân chim. Bạn có thể quan tâm đến sản phẩm chăm sóc da để
                                    giảm thiểu vết chân chim và tái tạo làn da xung quanh mắt.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.eye_finelines:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không có nếp nhăn vùng mắt</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề với nếp nhăn vùng mắt. Hãy khám phá ngay các sản phẩm chăm sóc da chống
                                    lão hóa để giảm thiểu nếp nhăn và làm cho vùng mắt trở nên trẻ trung hơn.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.pores_forehead:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Trán không nhiều lỗ chân lông</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề với lỗ chân lông trán. Hãy khám phá ngay các sản phẩm chăm sóc da để giảm
                                    tiết dầu và làm se lỗ chân lông.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.pores_left_cheek:
            case SKIN_ANALYSIS_LABEL.pores_right_cheek:
                switch (value) {
                    case 0:
                        return (
                            <Typography variant="h6">
                                {key === SKIN_ANALYSIS_LABEL.pores_left_cheek
                                    ? 'Má trái không nhiều lỗ chân lông'
                                    : 'Má phải không nhiều lỗ chân lông'}
                            </Typography>
                        );
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề với lỗ chân lông. Bạn có thể quan tâm đến sản phẩm chăm sóc da của chúng
                                    tôi.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.pores_jaw:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Cằm không nhiều lỗ chân lông</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề. Bạn có thể quan tâm đến các sản phẩm chăm sóc da để giảm thiểu lỗ chân
                                    lông.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }
            case SKIN_ANALYSIS_LABEL.blackhead:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không mụn đầu đen</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề. Bạn có thể quan tâm đến sản phẩm chăm sóc da để loại bỏ mụn đầu đen.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.acne:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không mụn</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề với mụn. Bạn có thể quan tâm đến sản phẩm chăm sóc da để làm dịu và kiểm
                                    soát tình trạng mụn.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            case SKIN_ANALYSIS_LABEL.skin_spot:
                switch (value) {
                    case 0:
                        return <Typography variant="h6">Không có nám</Typography>;
                    case 1:
                        return (
                            <Box>
                                <Typography>
                                    Có vấn đề với nám. Bạn có thể quan tâm đến các sản phẩm chăm sóc da để giảm thiểu và
                                    làm mờ nám da.
                                </Typography>
                                <Link to={CATEGORY_PATH.SKINCARE}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }}>
                                        Khám phá ngay
                                    </Button>
                                </Link>
                            </Box>
                        );
                    default:
                        return '';
                }

            default:
                return '';
        }
    };

    // Hàm hiển thị kết quả phân tích
    const renderAnalysis = (analysis, title) => {
        if (!analysis || typeof analysis !== 'object') return null;

        const value = analysis.value;
        const confidence = analysis.confidence;
        const description = getDescription(title, value);

        return (
            <Accordion key={title} defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${title}-content`}
                    id={`${title}-header`}
                >
                    <Typography>
                        <b>{title}:</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {value !== undefined && confidence !== undefined && (
                            <span>
                                <i>{description} </i> ({(confidence * 100).toFixed(2)}% Độ chính xác)
                            </span>
                        )}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        );
    };

    // Hàm hiển thị tất cả các kết quả phân tích
    const renderAllAnalysis = () => {
        if (!result || typeof result !== 'object') return null;

        return (
            <div>
                {Object.keys(result)
                    .filter((key) => Object.keys(SKIN_ANALYSIS_LABEL).includes(key))
                    .map((key) => {
                        return renderAnalysis(result[key], SKIN_ANALYSIS_LABEL[key]);
                    })}
            </div>
        );
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Kết quả phân tích da
            </Typography>
            {renderAllAnalysis()}
        </div>
    );
};

export default SkinAnalysisResult;
