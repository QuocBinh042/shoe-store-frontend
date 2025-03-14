import React from 'react';
import { Button, Result } from 'antd';
function Error() {

  return (
    <Result
      status="404"
      title="404"
      subTitle="The page you are looking for might have been removed had its name changed or is temporarily unavailable."
      extra={
        <Button type="primary" onClick={() => { window.location.href = "/"; }}>Back Home</Button>
      }
    />
  )
}

export default Error;