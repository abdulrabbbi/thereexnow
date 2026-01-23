import { Box } from "@mui/material";

const NotificationIcon = () => {
  return (
    <Box
      width={24}
      height={24}
      sx={{
        display: "flex",
        aspectRatio: "1/1",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={20} height={24} viewBox="0 0 26.519 30.82">
        <path
          id="Vector"
          d="M33.465,39.035v1.1a4.388,4.388,0,0,1-8.775,0v-1.1M40.847,36.8c-1.761-2.155-3-3.252-3-9.192,0-5.44-2.778-7.378-5.064-8.319a1.221,1.221,0,0,1-.682-.723A3.323,3.323,0,0,0,29.077,16a3.316,3.316,0,0,0-3.017,2.569,1.21,1.21,0,0,1-.682.722c-2.289.943-5.064,2.874-5.064,8.319,0,5.94-1.246,7.037-3.007,9.192a1.383,1.383,0,0,0,1.185,2.233H39.669A1.383,1.383,0,0,0,40.847,36.8Z"
          transform="translate(-15.817 -14.85)"
          fill="#E28913"
          stroke="#002434"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.3"
        />
      </svg>
    </Box>
  );
};

export default NotificationIcon;
