import { Card, List, Button } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const Alerts = ({ alerts }) => {
  return (
    <Card title="Notifications" style={{ marginBottom: '16px' }}>
      <List
        dataSource={alerts}
        renderItem={item => (
          <List.Item
            actions={[<Button size="small" type="link">View Details</Button>]}
          >
            <List.Item.Meta
              avatar={
                item.type === 'warning' ? <AlertOutlined style={{ color: '#faad14' }} /> :
                item.type === 'error' ? <AlertOutlined style={{ color: '#f5222d' }} /> :
                <AlertOutlined style={{ color: '#1890ff' }} />
              }
              title={item.message}
              description={`${new Date().toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Alerts; 