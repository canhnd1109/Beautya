import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import imageCompression from 'browser-image-compression';
import * as React from 'react';

import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import Loading from 'components/common/Loading/Loading';
import { storage } from 'server/firebase/firebaseConfig';
import { addProduct, getProduct, getProducts, updateProduct } from 'server/firebase/firestore/products';
import { CATEGORY, TYPE_OPTIONS } from 'utils/constants';
import { showErrorToast, showSuccessToast } from 'utils/showToasts';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function ProductFormDialog({ open, setOpen, setProducts, selectedProductId }) {
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        price: '',
        imageUrls: [],
        categories: [],
        types: [],
        ingredients: [],
        howToApply: [],
        stockCount: 0,
    });

    React.useEffect(() => {
        if (selectedProductId) {
            (async () => {
                try {
                    const product = await getProduct(selectedProductId);
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price.toString(),
                        imageUrls: product.imageUrls || [],
                        categories: product.categories,
                        types: product.types,
                        ingredients: product.ingredients || [],
                        howToApply: product.howToApply || [],
                        stockCount: product.stockCount || 0,
                    });
                } catch (err) {
                    showErrorToast(err.message);
                }
            })();
        } else {
            // Reset form data when transitioning from edit mode to add mode
            setFormData({
                name: '',
                description: '',
                price: '',
                imageUrls: [],
                categories: [],
                types: [],
                ingredients: [],
                howToApply: [],
                stockCount: 0,
            });
        }
    }, [selectedProductId]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoriesChange = (event) => {
        const {
            target: { value },
        } = event;

        // Filter out empty string from selected values
        const selectedCategories = Array.isArray(value) ? value.filter((category) => category !== '') : [];

        setFormData({
            ...formData,
            types: [],
            categories: selectedCategories,
        });
    };

    const handleTypesChange = (event) => {
        const {
            target: { value },
        } = event;

        // Filter out empty string from selected values
        const selectedTypes = Array.isArray(value) ? value.filter((type) => type !== '') : [];

        setFormData({
            ...formData,
            types: selectedTypes,
        });
    };

    const handleChangeImageUrl = (e, index) => {
        const newImageUrls = [...(formData.imageUrls || [])];

        if (newImageUrls[index] !== undefined) {
            const existingIndex = newImageUrls.indexOf(newImageUrls[index]);

            if (existingIndex !== -1) {
                newImageUrls[existingIndex] = e.target.value;
            }
        }

        setFormData({
            ...formData,
            imageUrls: newImageUrls,
        });
    };

    const handleDeleteImage = (index) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls.splice(index, 1);
        setFormData({
            ...formData,
            imageUrls: newImageUrls,
        });
    };

    const handleAddImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.onchange = (e) => handleImageUpload(e, formData.imageUrls.length);

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    const uploadImage = async (file, productId) => {
        const storageRef = ref(storage, `product-images/${productId}/${file.name}`);
        const snapshot = await uploadBytesResumable(storageRef, file);

        const imageUrl = await getDownloadURL(snapshot.ref);

        return imageUrl;
    };

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];

        try {
            // Show a placeholder image
            const placeholderImageUrl = '/assets/images/placeholder-image.webp';
            const newImageUrls = [...formData.imageUrls];
            newImageUrls[index] = placeholderImageUrl;
            setFormData({
                ...formData,
                imageUrls: newImageUrls,
            });

            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.2, // Adjust the maximum file size as needed
                maxWidthOrHeight: 800, // Adjust the maximum width or height as needed
            });

            // Proceed with the upload using the compressed file
            const imageUrl = await uploadImage(compressedFile, selectedProductId);

            newImageUrls[index] = imageUrl;
            setFormData({
                ...formData,
                imageUrls: newImageUrls,
            });
        } catch (error) {
            showErrorToast('Error uploading image: ' + error.message);
        }
    };

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, ''],
        });
    };

    const handleChangeIngredient = (e, index) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = e.target.value;
        setFormData({
            ...formData,
            ingredients: newIngredients,
        });
    };

    const handleDeleteIngredient = (index) => {
        const newIngredients = [...formData.ingredients];
        newIngredients.splice(index, 1);
        setFormData({
            ...formData,
            ingredients: newIngredients,
        });
    };

    const handleAddStep = () => {
        setFormData({
            ...formData,
            howToApply: [...formData.howToApply, ''],
        });
    };

    const handleChangeStep = (e, index) => {
        const newSteps = [...formData.howToApply];
        newSteps[index] = e.target.value;
        setFormData({
            ...formData,
            howToApply: newSteps,
        });
    };

    const handleDeleteStep = (index) => {
        const newSteps = [...formData.howToApply];
        newSteps.splice(index, 1);
        setFormData({
            ...formData,
            howToApply: newSteps,
        });
    };

    const handleClickSubmit = async () => {
        if (loading) {
            return;
        }

        // Validate required fields
        const requiredFields = ['name', 'price', 'categories', 'types', 'stockCount'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                showErrorToast(`Please enter a value for ${field}`);
                return;
            }
        }

        try {
            setLoading(true);

            let uploadedImageUrls = [];
            let updatedProductId = selectedProductId;
            let isProductAdded = false;

            if (!selectedProductId) {
                // If it's a new product, add it to get the product ID
                const newProductRef = await addProduct({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    imageUrls: formData.imageUrls,
                    categories: formData.categories,
                    types: formData.types,
                    ingredients: formData.ingredients,
                    howToApply: formData.howToApply,
                    stockCount: formData.stockCount,
                });

                showSuccessToast('Product added successfully!');
                updatedProductId = newProductRef.id;
                isProductAdded = true;
            }

            // Upload images and get the new image URLs
            uploadedImageUrls = await Promise.all(
                formData.imageUrls.map(async (url, index) => {
                    if (typeof url === 'object') {
                        const imageUrl = await uploadImage(url, updatedProductId);
                        handleChangeImageUrl({ target: { value: imageUrl } }, index);
                        return imageUrl;
                    }
                    return url;
                }),
            );

            // Update the product with the new image URLs
            await updateProduct({
                id: updatedProductId,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                imageUrls: uploadedImageUrls,
                categories: formData.categories,
                types: formData.types,
                ingredients: formData.ingredients,
                howToApply: formData.howToApply,
                stockCount: formData.stockCount,
            });

            // Fetch the latest products after adding or updating a product
            const updatedProducts = await getProducts();
            setProducts(updatedProducts);

            setLoading(false);
            setOpen(false);

            if (!isProductAdded) {
                showSuccessToast('Product updated successfully!');
            }
        } catch (err) {
            setLoading(false);
            // showErrorToast(err.message);
            console.error(err);
            setOpen(false);
        }
    };

    const categoryOptions = [
        { label: 'MAKE_UP', value: CATEGORY.MAKE_UP },
        { label: 'SKINCARE', value: CATEGORY.SKINCARE },
        { label: 'GIFTS_AND_SET', value: CATEGORY.GIFTS_AND_SETS },
    ];

    const [typeOptions, setTypeOptions] = React.useState([]);

    React.useEffect(() => {
        // Update the typeOptions array with the types of the selected categories
        const selectedCategoryIds = formData.categories;

        const updatedTypeOptions = TYPE_OPTIONS.filter((option) =>
            selectedCategoryIds.includes(option.categoryId),
        ).flatMap((option) => option.types);

        setTypeOptions(updatedTypeOptions);
    }, [formData.categories]);

    return (
        <React.Fragment>
            {loading && <Loading />}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {Boolean(selectedProductId) ? 'Cập nhật thông tin sản phẩm?' : 'Thêm sản phẩm mới?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Để {Boolean(selectedProductId) ? 'cập nhật thông tin' : 'thêm'} sản phẩm, vui lòng điền các
                        thông tin bên dưới.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Tên"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="price"
                        name="price"
                        label="Giá"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    <FormControl sx={{ marginBlock: 2, width: '100%' }}>
                        <InputLabel id="categories">Danh mục</InputLabel>
                        <Select
                            labelId="categories"
                            id="categories"
                            multiple
                            value={formData.categories}
                            onChange={handleCategoriesChange}
                            input={<OutlinedInput label="Danh mục" />}
                            renderValue={(selected) =>
                                selected
                                    .map((value) => {
                                        const category = categoryOptions.find((option) => option.value === value);
                                        return category ? category.label : '';
                                    })
                                    .join(', ')
                            }
                            MenuProps={MenuProps}
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={formData.categories.indexOf(option.value) > -1} />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ marginBlock: 2, width: '100%' }}>
                        <InputLabel id="types">Loại</InputLabel>
                        <Select
                            labelId="types"
                            id="types"
                            multiple
                            value={formData.types}
                            onChange={handleTypesChange}
                            input={<OutlinedInput label="Loại" />}
                            renderValue={(selected) =>
                                selected
                                    .filter((value) => value !== '')
                                    .map((value) => {
                                        const type = typeOptions.find((option) => option.value === value);
                                        return type ? type.label : '';
                                    })
                                    .join(', ')
                            }
                            MenuProps={MenuProps}
                        >
                            {typeOptions?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={formData.types.indexOf(option.value) > -1} />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="stockCount"
                        name="stockCount"
                        label="Còn lại"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={formData.stockCount}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        name="description"
                        label="Mô tả"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.description}
                        onChange={handleChange}
                        sx={{
                            mb: '2rem',
                        }}
                    />
                    <Stack direction="column" alignItems="center">
                        {formData.imageUrls.map((url, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`pic ${index + 1}`}
                                    style={{
                                        maxWidth: '100px', // Adjust the width to make it a little bigger
                                        maxHeight: '100px', // Adjust the width to make it a little bigger
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => document.getElementById(`image-upload-${index}`).click()}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    id={`image-upload-${index}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, index)}
                                />
                                <Button
                                    onClick={() => handleDeleteImage(index)}
                                    variant="contained"
                                    sx={{ marginLeft: 4 }}
                                    size="small"
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button onClick={handleAddImage} variant="contained">
                            Thêm ảnh
                        </Button>
                    </Stack>

                    <DialogContentText style={{ marginTop: '20px' }}>Thành phần:</DialogContentText>
                    {formData.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                id={`ingredient-${index}`}
                                name={`ingredient-${index}`}
                                label={`Thành phần ${index + 1}`}
                                type="text"
                                fullWidth
                                variant="standard"
                                value={ingredient}
                                onChange={(e) => handleChangeIngredient(e, index)}
                            />
                            <Button
                                onClick={() => handleDeleteIngredient(index)}
                                variant="contained"
                                size="small" // Set the size to small
                                sx={{ marginLeft: 4 }}
                            >
                                Xóa
                            </Button>
                        </div>
                    ))}
                    <Button onClick={handleAddIngredient} variant="contained">
                        Thêm thành phần
                    </Button>

                    <DialogContentText style={{ marginTop: '20px' }}>Cách áp dụng:</DialogContentText>
                    {formData.howToApply.map((step, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                id={`step-${index}`}
                                name={`step-${index}`}
                                label={`Bước ${index + 1}`}
                                type="text"
                                fullWidth
                                variant="standard"
                                value={step}
                                onChange={(e) => handleChangeStep(e, index)}
                            />
                            <Button
                                onClick={() => handleDeleteStep(index)}
                                variant="contained"
                                size="small" // Set the size to small
                                sx={{ marginLeft: 4 }}
                            >
                                Xóa
                            </Button>
                        </div>
                    ))}
                    <Button onClick={handleAddStep} variant="contained">
                        Thêm bước
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleClickSubmit}
                        variant="contained"
                        sx={{
                            marginLeft: 4, // Add some margin to the left
                        }}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
