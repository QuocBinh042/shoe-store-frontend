import { Modal, Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const LoginRequiredModal = ({ isOpen, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onConfirm}
      footer={[
        <Button key="ok" type="primary" onClick={onConfirm}>
          Go to Login
        </Button>,
      ]}
      centered
    >
      <div style={{ textAlign: "center", padding: "20px" }}>
        <ExclamationCircleOutlined style={{ fontSize: "48px", color: "#faad14" }} />
        <Typography.Title level={4} style={{ marginTop: "16px" }}>
          Login Required
        </Typography.Title>
        <Typography.Text type="secondary">
          You need to log in to access this page. Click the button below to proceed.
        </Typography.Text>
      </div>
    </Modal>
  );
};

export default LoginRequiredModal;
