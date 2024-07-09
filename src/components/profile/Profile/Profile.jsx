import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Pagination,
  Typography,
} from "@mui/material";
import imageCompression from "browser-image-compression";
import Loading from "components/common/Loading/Loading";
import { useAuth } from "contexts/authContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "server/firebase/firebaseConfig";
import {
  getOrdersOfUser,
  getUser,
  updateUserAvatar,
} from "server/firebase/firestore/users";
import { showErrorToast } from "utils/showToasts";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(
    (currentUser && currentUser.avatarUrl) || ""
  );
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Điều chỉnh nếu cần

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (user) {
          const userOrders = await getOrdersOfUser(user.uid);

          // Sắp xếp đơn hàng theo ngày đặt hàng giảm dần
          const sortedOrders = userOrders.sort(
            (a, b) => b.orderDate.seconds - a.orderDate.seconds
          );

          setOrders(sortedOrders);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (user) {
          const cur = await getUser(user.uid);
          setCurrentUser(cur);
          setAvatarUrl(cur.avatarUrl);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1, // Điều chỉnh dung lượng tối đa của file cần thiết
        maxWidthOrHeight: 400, // Điều chỉnh chiều rộng hoặc chiều cao tối đa cần thiết
      });

      const newAvatarUrl = URL.createObjectURL(compressedFile);
      setAvatarUrl(newAvatarUrl);

      try {
        setLoading(true);

        // Tải file lên Firebase Storage
        const storageRef = ref(
          storage,
          `avatar-images/${user.uid}/${compressedFile.name}`
        );
        await uploadBytes(storageRef, compressedFile);

        // Lấy URL của file đã tải lên
        const newAvatarUrl = await getDownloadURL(storageRef);

        // Cập nhật URL avatar mới của người dùng trong Firestore
        await updateUserAvatar(user.uid, newAvatarUrl);

        // Cập nhật trạng thái local với URL avatar mới
        setAvatarUrl(newAvatarUrl);
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Logic phân trang
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container component="main" maxWidth="xs">
      {loading && <Loading />}
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar src={avatarUrl} sx={{ width: 100, height: 100, my: 2 }} />
        <Typography component="p" variant="body2" sx={{ mb: 2 }}>
          {user?.email}
        </Typography>
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatarInput">
          <Button variant="contained" component="span" sx={{ mt: 2, mb: 1 }}>
            Đổi Avatar
          </Button>
        </label>
      </div>

      <div
        style={{
          marginBlock: "20px",
          padding: "20px",
          background: "#f8f8f8",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2, color: "#333" }}>
          Đơn hàng của bạn
        </Typography>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {currentOrders.map((order) => (
            <div
              key={order.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div>
                <strong>Mã đơn hàng:</strong> {order.id}
              </div>
              <div>
                <strong>Thanh toán:</strong> {order.paymentStatus}
              </div>
              <div>
                <strong>Trạng thái:</strong> {order.status}
              </div>
              <div>
                <strong>Ngày đặt hàng: </strong>
                {formatTimestamp(order.orderDate.seconds)}
              </div>
              <div>
                <strong>Tổng giá:</strong> {order.totalPrice}
              </div>
              <div>
                <strong>Họ tên:</strong> {order.fullName}
              </div>
              <div>
                <strong>Email:</strong> {order.email}
              </div>
              <div>
                <strong>Điện thoại:</strong> {order.phone}
              </div>
              <div>
                <strong>Địa chỉ giao hàng:</strong> {order.address}
              </div>
              <div>
                <strong>Sản phẩm:</strong>
                <ul
                  style={{ listStyle: "none", padding: 0, marginLeft: "10px" }}
                >
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        borderBottom: "1px solid #ccc",
                        paddingBottom: "5px",
                      }}
                    >
                      <div>
                        <strong>Sản phẩm:</strong> {item.name}
                      </div>
                      <div>
                        <strong>Số lượng:</strong> {item.quantity}
                      </div>
                      <div>
                        <strong>Giá:</strong> {item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(orders.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginY: 2, justifyContent: "center" }}
          />
        </Box>
      </div>
    </Container>
  );
};

export default Profile;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Chuyển đổi giây thành mili giây
  return date.toLocaleString(); // Điều chỉnh định dạng theo cần thiết
};
