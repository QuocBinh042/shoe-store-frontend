import { Spin } from "antd";
export default function LoadingSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <Spin size="large" />
    </div>
  );
}