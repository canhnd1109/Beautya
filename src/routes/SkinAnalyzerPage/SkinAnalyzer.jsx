import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import SkinAnalysisResult from './SkinAnalysisResult';
import { showErrorToast } from 'utils/showToasts';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from 'server/firebase/firebaseConfig';
import imageCompression from 'browser-image-compression';

const SkinAnalyzer = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiKey = process.env.REACT_APP_FACE_API_KEY;
    const apiSecret = process.env.REACT_APP_FACE_API_SECRET;
    const apiUrl = 'https://api-us.faceplusplus.com/facepp/v1/skinanalyze';

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 2, // Điều chỉnh dung lượng tối đa của file cần thiết
                maxWidthOrHeight: 800, // Điều chỉnh chiều rộng hoặc chiều cao tối đa cần thiết
            });

            try {
                setLoading(true);

                // Tải file lên Firebase Storage
                const storageRef = ref(storage, `skin-analyze-images/${compressedFile.name}`);
                await uploadBytes(storageRef, compressedFile);

                // Lấy URL của file đã tải lên
                const newUrl = await getDownloadURL(storageRef);

                // Cập nhật trạng thái local với URL avatar mới
                setSelectedImage(newUrl);
            } catch (error) {
                showErrorToast(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const analyzeSkinWithFacePlusPlus = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('api_secret', apiSecret);
            formData.append('image_url', selectedImage);

            const response = await axios.post(apiUrl, formData);

            const skinAnalysisResult = response.data;
            setAnalysisResult(skinAnalysisResult);
        } catch (error) {
            showErrorToast(error.response.data.error_message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '40px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ color: 'var(--primary, #A10550)', textAlign: 'center' }}>
                    Magic: Phân Tích và Đánh Giá Da Hiệu Quả
                </Typography>

                <Typography variant="body1" gutterBottom>
                    <b>Yêu cầu ảnh:</b>
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={<b>Định dạng:</b>} secondary="JPG (JPEG)" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={<b>Kích thước:</b>} secondary="Từ 200*200 đến 4096*4096 (pixels)" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={<b>Kích thước tệp:</b>} secondary="Không lớn hơn 2MB" />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={<b>Khuôn mặt:</b>}
                            secondary={<>Để đảm bảo độ chính xác của kết quả, nên có duy nhất 1 khuôn mặt trong ảnh.</>}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={<b>Chất lượng khuôn mặt:</b>}
                            secondary={
                                <>
                                    Chất lượng khuôn mặt càng cao, phân tích da càng chính xác. Những yếu tố ảnh hưởng
                                    đến chất lượng khuôn mặt bao gồm: che phủ các đặc điểm khuôn mặt, ảnh mờ, ánh sáng
                                    không đúng (chói, ánh sáng tối, ánh sáng phía sau), góc quay khuôn mặt quá mức (góc
                                    cuộn đề xuất ≤ ±45°, góc quay ≤ ±45°, góc nghiêng ≤ ±45°), v.v.
                                </>
                            }
                        />
                    </ListItem>
                </List>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={9}>
                        <input
                            type="file"
                            accept=".jpg, .jpeg"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageInput"
                        />
                        <label htmlFor="imageInput">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{
                                    borderColor: 'var(--primary, #A10550)',
                                    color: 'var(--primary, #A10550)',
                                }}
                            >
                                Chọn ảnh
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'var(--primary, #A10550)',
                            }}
                            onClick={analyzeSkinWithFacePlusPlus}
                            disabled={!selectedImage || loading}
                            fullWidth
                        >
                            Phân Tích Da
                        </Button>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        marginBlock: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {loading && <CircularProgress style={{ marginTop: '20px', color: 'var(--primary, #A10550)' }} />}
                </Box>

                {selectedImage && (
                    <Box
                        sx={{
                            marginBlock: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Ảnh:
                        </Typography>
                        <img
                            src={selectedImage}
                            alt="Da đã phân tích"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                alignSelf: 'center', // Center the image vertically
                                borderRadius: '8px', // Add a border radius for rounded corners
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
                            }}
                        />
                    </Box>
                )}

                {analysisResult && <SkinAnalysisResult result={analysisResult.result} />}
            </Paper>
        </Container>
    );
};

export default SkinAnalyzer;
