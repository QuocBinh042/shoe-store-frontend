import { Col, Input, Row, Select, DatePicker, Typography } from 'antd';
import { STATUS_OPTION } from '../../../../constants/orderConstant';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const OrderFilters = ({
  activeStatusOption,
  sortOption,
  searchText,
  dateRange,
  onStatusOptionChange,
  onSortChange,
  onSearch,
  onDateRangeChange,
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highestTotal', label: 'Highest Total' },
    { value: 'lowestTotal', label: 'Lowest Total' },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
      <Col xs={24} sm={12} lg={6}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Search
        </Text>
        <Input.Search
          placeholder="Order ID or Customer Name"
          allowClear
          onSearch={onSearch}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Sort
        </Text>
        <Select
          placeholder="Sort Orders"
          style={{ width: '100%' }}
          value={sortOption}
          onChange={onSortChange}
        >
          {sortOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Date Range
        </Text>
        <RangePicker 
          style={{ width: '100%' }} 
          value={dateRange}
          onChange={onDateRangeChange}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Status
        </Text>
        <Select
          value={activeStatusOption}
          onChange={onStatusOptionChange}
          style={{ width: '100%' }}
        >
          {STATUS_OPTION.map((tab) => (
            <Select.Option key={tab.key} value={tab.key}>
              {tab.label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default OrderFilters; 