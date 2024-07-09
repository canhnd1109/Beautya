import CircularProgress from "@mui/material/CircularProgress";

import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles["loading-container"]}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
