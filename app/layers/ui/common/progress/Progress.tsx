import React from 'react';
import { Progress } from 'antd';


type ProgressProps = {
  percent?: number
}

const QikProgress = ({percent}: ProgressProps) => (
  <Progress percent={percent}/>
)

export { QikProgress };