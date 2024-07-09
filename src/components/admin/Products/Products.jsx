import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import ConfirmDialog from 'components/common/ConfirmDialog/ConfirmDialog';
import Loading from 'components/common/Loading/Loading';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { deleteProduct, getProducts } from 'server/firebase/firestore/products';
import { CATEGORY, CATEGORY_REVERT, TYPE_REVERT } from 'utils/constants';
import { formattedPrice } from 'utils/formattedPrice';
import { showErrorToast, showSuccessToast } from 'utils/showToasts';
import ProductFormDialog from './ProductFormDialog/ProductFormDialog';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const allProducts = await getProducts();
                setProducts(allProducts);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                showErrorToast(e.message);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts =
        filterCategory === 'All' ? products : products.filter((product) => product.categories.includes(filterCategory));

    const sortedProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedProducts.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickAddProduct = () => {
        setSelectedProductId(null);
        setShowFormDialog(true);
    };

    const handleClickUpdateProduct = (id) => {
        setSelectedProductId(id);
        setShowFormDialog(true);
    };

    const handleClickDeleteProduct = (id) => {
        setSelectedProductId(id);
        setShowConfirmDialog(true);
    };

    const handleDeleteProduct = async (id) => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            await deleteProduct(id);
            setProducts(await getProducts());
            setLoading(false);
            showSuccessToast('Product deleted successfully!');
        } catch (err) {
            setLoading(false);
            showErrorToast(err.message);
        }
    };

    return (
        <Grid container spacing={2}>
            {loading && <Loading />}

            <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                        onClick={handleClickAddProduct}
                        startIcon={<AddIcon />}
                        sx={{
                            marginLeft: 4,
                        }}
                        variant="contained"
                    >
                        Thêm sản phẩm
                    </Button>
                    <Typography variant="subtitle1" sx={{ marginInline: 3 }}>
                        Tìm kiếm theo danh mục:
                    </Typography>
                    <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <MenuItem value="All">Tất cả</MenuItem>
                        <MenuItem value={CATEGORY.MAKE_UP}>Makeup</MenuItem>
                        <MenuItem value={CATEGORY.SKINCARE}>Skincare</MenuItem>
                        <MenuItem value={CATEGORY.GIFTS_AND_SETS}>Gifts and sets</MenuItem>
                    </Select>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500, marginBlock: 4 }} aria-label="products table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    ID
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Tên sản phẩm
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Giá
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Danh mục
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Loại sản phẩm
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Đã bán
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Còn lại
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Ảnh
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Sửa / Xóa
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : sortedProducts
                            ).map((product) => (
                                <TableRow key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row">
                                        {product.id}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {product.name}
                                    </TableCell>
                                    <TableCell align="center">{formattedPrice(product.price)}</TableCell>
                                    <TableCell align="center">
                                        {product.categories.map((categoryId) => (
                                            <div key={categoryId}>{CATEGORY_REVERT[categoryId]}</div>
                                        ))}
                                    </TableCell>
                                    <TableCell align="center">
                                        {product.types.map((typeId) => (
                                            <div key={typeId}>{TYPE_REVERT[typeId]}</div>
                                        ))}
                                    </TableCell>
                                    <TableCell align="center">{product.soldCount}</TableCell>
                                    <TableCell align="center">{product.stockCount}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                alignItems: 'center',
                                            }}
                                        >
                                            {product.imageUrls[0] && (
                                                <Box component="img" src={product.imageUrls[0]} width={50} />
                                            )}
                                            {product.imageUrls.length > 1 && (
                                                <Typography variant="body2" color="textSecondary">
                                                    {' '}
                                                    (and more...)
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: 2,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Button
                                                onClick={() => handleClickUpdateProduct(product.id)}
                                                variant="contained"
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Button
                                                onClick={() => handleClickDeleteProduct(product.id)}
                                                variant="contained"
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={8} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                                    colSpan={8}
                                    count={sortedProducts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <ConfirmDialog
                    open={showConfirmDialog}
                    setOpen={setShowConfirmDialog}
                    label="Xóa sản phẩm?"
                    content={
                        <>
                            <Typography variant="body1">Bạn có chắc chắn muốn xóa sản phẩm này?</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Hành động này không thể được hoàn tác. Hãy chắc chắn rằng bạn thực sự muốn xóa mặt hàng
                                này khỏi kho của bạn.
                            </Typography>
                        </>
                    }
                    onClickAgree={() => handleDeleteProduct(selectedProductId)}
                />
                <ProductFormDialog
                    open={showFormDialog}
                    setOpen={setShowFormDialog}
                    setProducts={setProducts}
                    selectedProductId={selectedProductId}
                />
            </Grid>
        </Grid>
    );
}
